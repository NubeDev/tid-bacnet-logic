import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Utils from '../utils';

import * as IOs from '../io';

import { apdu, APDU } from './apdu.layer';

import * as Interfaces from '../interfaces';

export class NPDU {
    public readonly className: string = 'NPDU';
    private apdu: APDU;

    constructor (apduInst: APDU) {
        this.apdu = apduInst;
    }

    /**
     * getControlFlags - parses the NPDU control byte.
     *
     * @param  {number} mControl - NPDU control byte
     * @return {Interfaces.NPDU.Read.Control}
     */
    public getControlFlags (mControl: number): Interfaces.NPDU.Read.Control {
        const noApduMessageType = !!Utils.Typer.getBit(mControl, 7);

        const reserved1 = Utils.Typer.getBit(mControl, 6);

        const destSpecifier = !!Utils.Typer.getBit(mControl, 5);

        const reserved2 = Utils.Typer.getBit(mControl, 4);

        const srcSpecifier = !!Utils.Typer.getBit(mControl, 3);

        const expectingReply = !!Utils.Typer.getBit(mControl, 2);

        const priority1 = Utils.Typer.getBit(mControl, 1);

        const priority2 = Utils.Typer.getBit(mControl, 0);

        const mControlMap: Interfaces.NPDU.Read.Control = {
            noApduMessageType: noApduMessageType,
            reserved1: reserved1,
            destSpecifier: destSpecifier,
            reserved2: reserved2,
            srcSpecifier: srcSpecifier,
            expectingReply: expectingReply,
            priority1: priority1,
            priority2: priority2,
        };

        return mControlMap;
    }

    /**
     * getFromBuffer - parses the NPDU message.
     *
     * @param  {Buffer} buf - js Buffer with NPDU message
     * @return {Interfaces.NPDU.Read.Layer}
     */
    public getFromBuffer (buf: Buffer): Interfaces.NPDU.Read.Layer {
        const readerUtil = new IOs.Reader(buf);

        let mVersion: number, mControl: Interfaces.NPDU.Read.Control;
        let destNetwork: Interfaces.NPDU.Read.NetworkDest,
            srcNetwork: Interfaces.NPDU.Read.NetworkSrc;
        let APDUMessage: Interfaces.APDU.Read.Layer;

        try {
            mVersion = readerUtil.readUInt8();

            const mControlByte = readerUtil.readUInt8();
            mControl = this.getControlFlags(mControlByte);

            if (mControl.destSpecifier) {
                const mNetworkAddress = readerUtil.readUInt16BE();

                const mMacAddressLen = readerUtil.readUInt8();

                destNetwork = {
                    networkAddress: mNetworkAddress,
                    macAddressLen: mMacAddressLen,
                };

                if (mMacAddressLen) {
                    const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
                    destNetwork.macAddress = mMacAddress;
                }
            }

            if (mControl.srcSpecifier) {
                const mNetworkAddress = readerUtil.readUInt16BE();

                const mMacAddressLen = readerUtil.readUInt8();

                srcNetwork = {
                    networkAddress: mNetworkAddress,
                    macAddressLen: mMacAddressLen,
                };

                if (mMacAddressLen) {
                    const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
                    srcNetwork.macAddress = mMacAddress;
                }
            }

            if (mControl.destSpecifier) {
                const mHopCount = readerUtil.readUInt8();
                destNetwork.hopCount = mHopCount;
            }

            const APDUstart = readerUtil.offset.getVaule();
            const APDUbuffer = readerUtil.getRange(APDUstart);

            APDUMessage = this.apdu.getFromBuffer(APDUbuffer);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        const NPDUMessage: Interfaces.NPDU.Read.Layer = {
            version: mVersion,
            control: mControl,
            dest: destNetwork,
            src: srcNetwork,
            apdu: APDUMessage,
        };

        return NPDUMessage;
    }

    /**
     * writeNPDULayer - writes the "NPDU" layer message.
     *
     * @param  {Interfaces.NPDU.Write.Layer} params - "NPDU" write params
     * @return {IOs.Writer} - instance of the writer utility
     */
    public writeNPDULayer (params: Interfaces.NPDU.Write.Layer): IOs.Writer {
        let writer = new IOs.Writer();

        // Write NPDU version
        writer.writeUInt8(0x01);

        // Write control byte
        const writerControl = this.writeNPDULayerControl(params.control);
        writer = IOs.Writer.concat(writer, writerControl);

        if (_.get(params, 'control.destSpecifier')) {
            // Write destination network address
            writer.writeUInt16BE(params.destNetworkAddress);

            // Write length of destination MAC address
            const mMacAddressLen = _.get(params, 'destMacAddress', '').length;
            writer.writeUInt8(mMacAddressLen);

            if (mMacAddressLen) {
                // Write destination MAC address
                writer.writeString(params.destMacAddress);
            }
        }

        if (_.get(params, 'control.srcSpecifier')) {
            // Write source network address
            writer.writeUInt16BE(params.srcNetworkAddress);

            // Write length of source MAC address
            const mMacAddressLen = _.get(params, 'srcMacAddress', '').length;
            writer.writeUInt8(mMacAddressLen);

            if (mMacAddressLen) {
                // Write source MAC address
                writer.writeString(params.srcMacAddress);
            }
        }

        if (_.isNumber(params.hopCount)) {
            // Write hop count
            writer.writeUInt8(params.hopCount);
        }

        return writer;
    }

    /**
     * writeNPDULayerControl - writes the "control byte" of "NPDU" layer.
     *
     * @param  {Interfaces.NPDU.Write.Control} params - "NPDU" write params for "control byte"
     * @return {IOs.Writer} - instance of the writer utility
     */
    public writeNPDULayerControl (params: Interfaces.NPDU.Write.Control): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        let control = 0x00;

        if (params) {
            // Set "no APDU Message" flag
            control = params.noApduMessageType
                ? Utils.Typer.setBit(control, 7, params.noApduMessageType) : control;

            // Set "destination specifier" flag
            control = params.destSpecifier
                ? Utils.Typer.setBit(control, 5, params.destSpecifier) : control;

            // Set "source specifier" flag
            control = params.srcSpecifier
                ? Utils.Typer.setBit(control, 3, params.srcSpecifier) : control;

            // Set "expecting reply" flag
            control = params.expectingReply
                ? Utils.Typer.setBit(control, 2, params.expectingReply) : control;

            // Set second priority bit
            control = _.isNumber(params.priority1)
                ? Utils.Typer.setBit(control, 1, !!params.priority1) : control;

            // Set first priority bit
            control = _.isNumber(params.priority2)
                ? Utils.Typer.setBit(control, 0, !!params.priority2) : control;
        }

        writer.writeUInt8(control);

        return writer;
    }
}

export const npdu: NPDU = new NPDU(apdu);

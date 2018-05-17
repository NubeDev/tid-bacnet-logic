import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as Utils from '../../utils';

import * as IOs from '../../io';

import { APDU } from './apdu.layer';

import * as Interfaces from '../../interfaces';

export class NPDU {
    static readonly className: string = 'NPDU';
    private apdu: APDU;

    constructor (apduInst: APDU) {
        this.apdu = apduInst;
    }

    /**
     * Parses the NPDU message.
     *
     * @param  {Buffer} buf - js Buffer with NPDU message
     * @return {Interfaces.NPDU.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.NPDU.Read.Layer {
        let mVersion: number, mControl: Interfaces.NPDU.Read.Control;
        let destNetwork: Interfaces.NPDU.Read.NetworkDest,
            srcNetwork: Interfaces.NPDU.Read.NetworkSrc;
        let APDUMessage: Interfaces.APDU.Read.Layer;

        try {
            mVersion = reader.readUInt8();

            const mControlByte = reader.readUInt8();
            mControl = this.parseControlFlags(mControlByte);

            if (mControl.destSpecifier) {
                const mNetworkAddress = reader.readUInt16BE();

                const mMacAddressLen = reader.readUInt8();

                destNetwork = {
                    networkAddress: mNetworkAddress,
                    macAddressLen: mMacAddressLen,
                };

                if (mMacAddressLen) {
                    const mMacAddress = reader.readString('hex', mMacAddressLen);
                    destNetwork.macAddress = mMacAddress;
                }
            }

            if (mControl.srcSpecifier) {
                const mNetworkAddress = reader.readUInt16BE();

                const mMacAddressLen = reader.readUInt8();

                srcNetwork = {
                    networkAddress: mNetworkAddress,
                    macAddressLen: mMacAddressLen,
                };

                if (mMacAddressLen) {
                    const mMacAddress = reader.readString('hex', mMacAddressLen);
                    srcNetwork.macAddress = mMacAddress;
                }
            }

            if (mControl.destSpecifier) {
                const mHopCount = reader.readUInt8();
                destNetwork.hopCount = mHopCount;
            }

            APDUMessage = APDU.readLayer(reader);
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
     * HELPERs
     */

    /**
     * getControlFlags - parses the NPDU control byte.
     *
     * @param  {number} mControl - NPDU control byte
     * @return {Interfaces.NPDU.Read.Control}
     */
    static parseControlFlags (mControl: number): Interfaces.NPDU.Read.Control {
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
}

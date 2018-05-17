import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as Utils from '../../utils';

import * as IOs from '../../io';

import * as Interfaces from '../../interfaces';

export class NPDU {
    static readonly className: string = 'NPDU';

    /**
     * Writes the "NPDU" layer message.
     *
     * @param  {Interfaces.NPDU.Write.Layer} params - "NPDU" write params
     * @return {IOs.Writer} - instance of the writer utility
     */
    static writeLayer (params: Interfaces.NPDU.Write.Layer): IOs.Writer {
        let writer = new IOs.Writer();

        // Write NPDU version
        writer.writeUInt8(0x01);

        // Write control byte
        const writerControl = this.writeControlByte(params.control);
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
     * Writes the "control byte" of "NPDU" layer.
     *
     * @param  {Interfaces.NPDU.Write.Control} params - "NPDU" write params for "control byte"
     * @return {IOs.Writer} - instance of the writer utility
     */
    static writeControlByte (params: Interfaces.NPDU.Write.Control): IOs.Writer {
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

import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as Helpers from '../../../helpers';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class UnconfirmedRequest {
    static readonly className: string = 'UnconfirmedReqPDU';

    /**
     * Writes the "APDU Unconfirmed Request" header.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.Layer} params - "APDU Unconfirmed Request" write params
     * @return {IOs.Writer}
     */
    static writeHeader (params: Interfaces.UnconfirmedRequest.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        const mMeta = Utils.Typer.setBitRange(0x00, 4, 4, Enums.ServiceType.UnconfirmedReqPDU);
        writer.writeUInt8(mMeta);

        return writer;
    }

    /**
     * Writes the "APDU Unconfirmed Request Who Is" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.WhoIs} params - "APDU Unconfirmed Request Who Is" write params
     * @return {IOs.Writer}
     */
    static writeWhoIs (params: Interfaces.UnconfirmedRequest.Write.WhoIs): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.whoIs);

        return writer;
    }

    /**
     * Writes the "APDU Unconfirmed Request I Am" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.IAm} params - "APDU Unconfirmed Request I Am" write params
     * @return {IOs.Writer}
     */
    static writeIAm (params: Interfaces.UnconfirmedRequest.Write.IAm): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.iAm);

        // Write Object identifier
        params.objId.writeValue(writer);

        // Write maxAPDUlength (1476 chars)
        const maxAPDUlength = new BACnetTypes.BACnetUnsignedInteger(0x05c4);
        maxAPDUlength.writeValue(writer);

        // Write Segmentation supported
        const segmSupported = new BACnetTypes.BACnetEnumerated(0x00);
        segmSupported.writeValue(writer);

        // Write Vendor ID
        params.vendorId.writeValue(writer);

        return writer;
    }

    /**
     * Writes the "APDU Unconfirmed Request CoV Notification" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.COVNotification} params - "APDU Unconfirmed Request CoV Notification" write params
     * @return {IOs.Writer}
     */
    static writeCOVNotification (params: Interfaces.UnconfirmedRequest.Write.COVNotification): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.covNotification);

        // Write Process Identifier
        params.subProcessId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Object Identifier for master Object
        params.devId.writeParam(writer, { num: 1, type: Enums.TagType.context });

        // Write Object Identifier for slave Object
        params.objId.writeParam(writer, { num: 2, type: Enums.TagType.context });

        // Write timer remaining
        if (params.timeRemaining) {
            params.timeRemaining.writeParam(writer, { num: 3, type: Enums.TagType.context });
        } else {
            const timeRemaining = new BACnetTypes.BACnetUnsignedInteger(0x00);
            timeRemaining.writeParam(writer, { num: 3, type: Enums.TagType.context });
        }

        Helpers.Writer.writeProperties(writer, params.listOfValues, { num: 4, type: Enums.TagType.context });

        return writer;
    }
}

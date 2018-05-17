import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as Helpers from '../../../helpers';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class ConfirmedRequest {
    static readonly className: string = 'ConfirmedReqPDU';

    /**
     * Writes the "APDU Confirmed Request" header.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.Layer} params - "APDU Confirmed Request" write params
     * @return {IOs.Writer}
     */
    static writeHeader (params: Interfaces.ConfirmedRequest.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        let mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.ConfirmedReqPDU, 4, 4);
        mMeta = Utils.Typer.setBit(mMeta, 1, params.segAccepted || false);
        writer.writeUInt8(mMeta);

        // Write max response size
        writer.writeUInt8(0x05);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * Writes the "APDU Confirmed Request Read Property" message.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.ReadProperty} params - "APDU Confirmed Request Read Property" write params
     * @return {IOs.Writer}
     */
    static writeReadProperty (params: Interfaces.ConfirmedRequest.Write.ReadProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.ReadProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.TagType.context });
        }

        return writer;
    }

    /**
     * Writes the "APDU Confirmed Request Write Property" message.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.WriteProperty} params - "APDU Confirmed Request Write Property" write params
     * @return {IOs.Writer}
     */
    static writeWriteProperty (params: Interfaces.ConfirmedRequest.Write.WriteProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.WriteProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.TagType.context });
        }

        // Write Property Value
        Helpers.Writer.writeValue(writer, params.prop.values, { num: 3, type: Enums.TagType.context });

        if (params.prop.priority) {
            // Write Property Priority
            params.prop.priority.writeParam(writer, { num: 4, type: Enums.TagType.context });
        }

        return writer;
    }

    /**
     * Writes the "APDU Confirmed Request Subscribe CoV" message to subscribe or
     * re-subscribe to the CoV events.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.SubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    static writeSubscribeCOV (params: Interfaces.ConfirmedRequest.Write.SubscribeCOV): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.SubscribeCOV);

        // Write Subscriber Process Identifier
        params.subProcessId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Monitored Object Identifier
        params.objId.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (_.isNil(params.issConfNotif)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.issConfNotif.writeParam(writer, { num: 2, type: Enums.TagType.context });

        if (_.isNil(params.lifetime)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.lifetime.writeParam(writer, { num: 3, type: Enums.TagType.context });

        return writer;
    }

    /**
     * Writes the "APDU Confirmed Request Subscribe CoV" message to cancel the
     * CoV subscription.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.UnsubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    static writeUnsubscribeCOV (params: Interfaces.ConfirmedRequest.Write.UnsubscribeCOV): IOs.Writer {
        return this.writeSubscribeCOV(params as Interfaces.ConfirmedRequest.Write.SubscribeCOV);
    }
}

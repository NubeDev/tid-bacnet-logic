import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class SimpleACK {
    static readonly className: string = 'SimpleACKPDU';

    /**
     * Writes the "APDU Simple ACK" header.
     *
     * @param  {Interfaces.SimpleACK.Write.Layer} params - "APDU Simple ACK" write params
     * @return {IOs.Writer}
     */
    static writeHeader (params: Interfaces.SimpleACK.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        const mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.SimpleACKPDU, 4, 4);
        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * Writes the "APDU Simple ACK Subscribe CoV" message.
     *
     * @param  {Interfaces.SimpleACK.Write.SubscribeCOV} params - "APDU Simple ACK Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    static writeSubscribeCOV (params: Interfaces.SimpleACK.Write.SubscribeCOV): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.SubscribeCOV);

        return writer;
    }

    /**
     * Writes the "APDU Simple ACK Write Property" message.
     *
     * @param  {Interfaces.SimpleACK.Write.WriteProperty} params - "APDU Simple ACK Write Property" write params
     * @return {IOs.Writer}
     */
    static writeWriteProperty (params: Interfaces.SimpleACK.Write.WriteProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.WriteProperty);

        return writer;
    }
}

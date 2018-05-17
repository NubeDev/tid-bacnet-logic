import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class ComplexACK {
    static readonly className: string = 'ComplexACKPDU';

    /**
     * Writes the "APDU Complex ACK" header.
     *
     * @param  {Interfaces.ComplexACK.Write.Layer} params - "APDU Complex ACK" write params
     * @return {IOs.Writer}
     */
    static writeHeader (params: Interfaces.ComplexACK.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write service meta
        // Set service type
        let mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.ComplexACKPDU, 4, 4);

        // Set service SEG flag
        if (!_.isNil(params.seg)) {
            mMeta = Utils.Typer.setBit(mMeta, 3, params.seg);
        }

        // Set service MOR flag
        if (!_.isNil(params.mor)) {
            mMeta = Utils.Typer.setBit(mMeta, 2, params.mor);
        }

        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * Writes the "APDU Complex ACK Read Property" message.
     *
     * @param  {Interfaces.ComplexACK.Write.ReadProperty} params - "APDU Complex ACK Read Property" write params
     * @return {IOs.Writer}
     */
    static writeReadProperty (params: Interfaces.ComplexACK.Write.ReadProperty): IOs.Writer {
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

        // Write Property Value
        Utils.Writer.writeValue(writer, params.prop.values, { num: 3, type: Enums.TagType.context });

        return writer;
    }
}

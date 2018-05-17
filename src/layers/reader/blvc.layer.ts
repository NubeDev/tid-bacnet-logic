import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as IOs from '../../io';

import { NPDU } from './npdu.layer';

import * as Interfaces from '../../interfaces';

export class BLVC {
    static readonly className: string = 'BLVC';

    /**
     * Parses the "BLVC" message.
     *
     * @param  {Buffer} buf - js Buffer with "BLVC" message
     * @return {Interfaces.BLVC.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.BLVC.Read.Layer {
        let mType: number, mFunction: number, mLenght: number;
        let NPDUMessage: Interfaces.NPDU.Read.Layer;

        try {
            mType = reader.readUInt8();
            mFunction = reader.readUInt8();
            mLenght = reader.readUInt16BE();

            NPDUMessage = NPDU.readLayer(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        const BLVCMessage: Interfaces.BLVC.Read.Layer = {
            type: mType,
            func: mFunction,
            length: mLenght,
            npdu: NPDUMessage,
        };

        return BLVCMessage;
    }
}

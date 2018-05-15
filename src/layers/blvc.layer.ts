import * as _ from 'lodash';

import { BACnetError } from '../errors';

import * as IOs from '../io';

import { npdu, NPDU } from './npdu.layer';

import * as Interfaces from '../interfaces';

export class BLVC {
    public readonly className: string = 'BLVC';
    private npdu: NPDU;

    constructor (npduInst: NPDU) {
        this.npdu = npduInst;
    }

    /**
     * getFromBuffer - parses the "BLVC" message.
     *
     * @param  {Buffer} buf - js Buffer with "BLVC" message
     * @return {Interfaces.BLVC.Read.Layer}
     */
    public getFromBuffer (buf: Buffer): Interfaces.BLVC.Read.Layer {
        const readerUtil = new IOs.Reader(buf);

        let mType: number, mFunction: number, mLenght: number;
        let NPDUMessage: Interfaces.NPDU.Read.Layer;

        try {
            mType = readerUtil.readUInt8();
            mFunction = readerUtil.readUInt8();
            mLenght = readerUtil.readUInt16BE();

            const NPDUstart = readerUtil.offset.getVaule();
            const NPDUbuffer = readerUtil.getRange(NPDUstart, mLenght);

            NPDUMessage = this.npdu.getFromBuffer(NPDUbuffer);
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        const BLVCMessage: Interfaces.BLVC.Read.Layer = {
            type: mType,
            func: mFunction,
            length: mLenght,
            npdu: NPDUMessage,
        };

        return BLVCMessage;
    }

    /**
     * writeBLVCLayer - writes the "BLVC" layer message.
     *
     * @param  {Interfaces.BLVC.Write.Layer} params - "BLVC" write params
     * @return {IOs.Writer} - instance of the writer utility
     */
    public writeBLVCLayer (params: Interfaces.BLVC.Write.Layer): IOs.Writer {
        let writer = new IOs.Writer();

        // Write BLVC type
        writer.writeUInt8(0x81);

        // Write BLVC function
        writer.writeUInt8(params.func);

        // Write message size
        const apduSize = _.get(params, 'apdu.size', 0);
        const npduSize = _.get(params, 'npdu.size', 0);
        const blvcSize = writer.size + 2;
        const sumSize = blvcSize + npduSize + apduSize;
        writer.writeUInt16BE(sumSize);

        return writer;
    }
}

export const blvc: BLVC = new BLVC(npdu);

import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as IOs from '../../io';

import { NPDU } from './npdu.layer';

import * as Interfaces from '../../interfaces';

export class BLVC {
    static readonly className: string = 'BLVC';

    /**
     * writeBLVCLayer - writes the "BLVC" layer message.
     *
     * @param  {Interfaces.BLVC.Write.Layer} params - "BLVC" write params
     * @return {IOs.Writer} - instance of the writer utility
     */
    static writeLayer (params: Interfaces.BLVC.Write.Layer): IOs.Writer {
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

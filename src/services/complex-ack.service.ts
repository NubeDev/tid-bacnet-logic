import * as Enums from '../enums';

import { complexACKPDU } from '../layers/apdus';
import { blvc, npdu } from '../layers';

import * as IOs from '../io';

import {
    ComplexACK,
} from '../interfaces';

export class ComplexACKService {
    static readonly className: string = 'ComplexACK';

    /**
     * Creates the "readProperty" complex ack request message.
     *
     * @static
     * @param  {ComplexACK.Service.ReadProperty} opts - request options
     * @return {type}
     */
    static readProperty (opts: ComplexACK.Service.ReadProperty): Buffer {
        // Generate APDU writer
        const writerComplexACK = complexACKPDU.writeReq(opts);
        const writerReadProperty = complexACKPDU.writeReadProperty(opts);
        const writerAPDU = IOs.Writer.concat(writerComplexACK, writerReadProperty);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = IOs.Writer.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return msgBACnet;
    }
}

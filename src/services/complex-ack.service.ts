import {
    BLVCFunction,
} from '../enums';

import { complexACKPDU } from '../layers/apdus';
import { blvc, npdu } from '../layers';

import { BACnetWriter } from '../io';

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
        const writerAPDU = BACnetWriter.concat(writerComplexACK, writerReadProperty);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriter.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return msgBACnet;
    }
}

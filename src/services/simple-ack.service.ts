import * as Enums from '../enums';

import { complexACKPDU, simpleACKPDU } from '../layers/apdus';
import { blvc, npdu } from '../layers';

import { BACnetWriter } from '../io';

import {
    SimpleACK,
} from '../interfaces';

export class SimpleACKService {
    static readonly className: string = 'SimpleACK';

    /**
     * Create the "subscribeCOV" simple ack request message.
     *
     * @static
     * @param  {SimpleACK.Service.SubscribeCOV} opts - request options
     * @return {Buffer}
     */
    static subscribeCOV (opts: SimpleACK.Service.SubscribeCOV): Buffer {
        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq(opts);
        const writerSubscribeCOV = simpleACKPDU.writeSubscribeCOV(opts);
        const writerAPDU = BACnetWriter.concat(writerSimpleACKPDU, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BACnet.BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriter.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return msgBACnet;
    }

    /**
     * Creates the "writeProperty" simple ack request message.
     *
     * @static
     * @param  {SimpleACK.Service.WriteProperty} opts - request options
     * @return {Buffer}
     */
    static writeProperty (opts: SimpleACK.Service.WriteProperty): Buffer {
        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq(opts);
        const writerSubscribeCOV = simpleACKPDU.writeWriteProperty(opts);
        const writerAPDU = BACnetWriter.concat(writerSimpleACKPDU, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BACnet.BLVCFunction.originalUnicastNPDU,
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

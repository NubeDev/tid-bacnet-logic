import * as Enums from '../enums';

import { confirmedReqPDU } from '../layers/apdus';
import { blvc, npdu } from '../layers';

import { BACnetWriter } from '../io';

import {
    ConfirmedRequest,
} from '../interfaces';

export class ConfirmedReqService {
    static readonly className: string = 'ConfirmedReq';

    /**
     * Creates the "readProperty" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.ReadProperty} opts - request options
     * @return {Buffer}
     */
    static readProperty (opts: ConfirmedRequest.Service.ReadProperty): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = confirmedReqPDU.writeReq(opts);
        const writerReadProperty = confirmedReqPDU.writeReadProperty(opts);
        const writerAPDU = BACnetWriter.concat(writerConfirmedReq, writerReadProperty);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BLVCFunction.originalUnicastNPDU,
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
     * Creates the "writeProperty" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.WriteProperty} opts - request options
     * @return {Buffer}
     */
    static writeProperty (opts: ConfirmedRequest.Service.WriteProperty): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = confirmedReqPDU.writeReq(opts);
        const writerWriteProperty = confirmedReqPDU.writeWriteProperty(opts);
        const writerAPDU = BACnetWriter.concat(writerConfirmedReq, writerWriteProperty);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BLVCFunction.originalUnicastNPDU,
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
     * Creates the "subscribeCOV" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.SubscribeCOV} opts - request options
     * @return {Buffer}
     */
    static subscribeCOV (opts: ConfirmedRequest.Service.SubscribeCOV): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = confirmedReqPDU.writeReq(opts);
        const writerSubscribeCOV = confirmedReqPDU.writeSubscribeCOV(opts);
        const writerAPDU = BACnetWriter.concat(writerConfirmedReq, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BLVCFunction.originalUnicastNPDU,
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
     * Creates the "unsubscribeCOV" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.UnsubscribeCOV} opts - request options
     * @return {Buffer}
     */
    static unsubscribeCOV (opts: ConfirmedRequest.Service.UnsubscribeCOV): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = confirmedReqPDU.writeReq(opts);
        const writerUnsubscribeCOV = confirmedReqPDU.writeUnsubscribeCOV(opts);
        const writerAPDU = BACnetWriter.concat(writerConfirmedReq, writerUnsubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: Enums.BLVCFunction.originalUnicastNPDU,
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

import * as Enums from '../enums';

import * as Layers from '../layers';

import * as IOs from '../io';

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
        const writerConfirmedReq = Layers.Writer.APDU.ConfirmedRequest.writeHeader(opts);
        const writerReadProperty = Layers.Writer.APDU.ConfirmedRequest.writeReadProperty(opts);
        const writerAPDU = IOs.Writer.concat(writerConfirmedReq, writerReadProperty);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({});

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
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

    /**
     * Creates the "writeProperty" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.WriteProperty} opts - request options
     * @return {Buffer}
     */
    static writeProperty (opts: ConfirmedRequest.Service.WriteProperty): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = Layers.Writer.APDU.ConfirmedRequest.writeHeader(opts);
        const writerWriteProperty = Layers.Writer.APDU.ConfirmedRequest.writeWriteProperty(opts);
        const writerAPDU = IOs.Writer.concat(writerConfirmedReq, writerWriteProperty);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({});

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
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

    /**
     * Creates the "subscribeCOV" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.SubscribeCOV} opts - request options
     * @return {Buffer}
     */
    static subscribeCOV (opts: ConfirmedRequest.Service.SubscribeCOV): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = Layers.Writer.APDU.ConfirmedRequest.writeHeader(opts);
        const writerSubscribeCOV = Layers.Writer.APDU.ConfirmedRequest.writeSubscribeCOV(opts);
        const writerAPDU = IOs.Writer.concat(writerConfirmedReq, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({});

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
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

    /**
     * Creates the "unsubscribeCOV" confirmed request message.
     *
     * @static
     * @param  {ConfirmedRequest.Service.UnsubscribeCOV} opts - request options
     * @return {Buffer}
     */
    static unsubscribeCOV (opts: ConfirmedRequest.Service.UnsubscribeCOV): Buffer {
        // Generate APDU writer
        const writerConfirmedReq = Layers.Writer.APDU.ConfirmedRequest.writeHeader(opts);
        const writerUnsubscribeCOV = Layers.Writer.APDU.ConfirmedRequest.writeUnsubscribeCOV(opts);
        const writerAPDU = IOs.Writer.concat(writerConfirmedReq, writerUnsubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({});

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
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

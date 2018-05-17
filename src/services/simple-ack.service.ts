import * as Enums from '../enums';

import * as Layers from '../layers';

import * as IOs from '../io';

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
        const writerSimpleACKPDU = Layers.Writer.APDU.SimpleACK.writeHeader(opts);
        const writerSubscribeCOV = Layers.Writer.APDU.SimpleACK.writeSubscribeCOV(opts);
        const writerAPDU = IOs.Writer.concat(writerSimpleACKPDU, writerSubscribeCOV);

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
     * Creates the "writeProperty" simple ack request message.
     *
     * @static
     * @param  {SimpleACK.Service.WriteProperty} opts - request options
     * @return {Buffer}
     */
    static writeProperty (opts: SimpleACK.Service.WriteProperty): Buffer {
        // Generate APDU writer
        const writerSimpleACKPDU = Layers.Writer.APDU.SimpleACK.writeHeader(opts);
        const writerSubscribeCOV = Layers.Writer.APDU.SimpleACK.writeWriteProperty(opts);
        const writerAPDU = IOs.Writer.concat(writerSimpleACKPDU, writerSubscribeCOV);

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

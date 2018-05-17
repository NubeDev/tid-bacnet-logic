import * as Enums from '../enums';

import * as Layers from '../layers';

import * as IOs from '../io';

import {
    UnconfirmedRequest,
} from '../interfaces';

export class UnconfirmedReqService {
    static readonly className: string = 'UnconfirmedReq';

    /**
     * Create the "whoIs" unconfirmed request message.
     *
     * @static
     * @param  {UnconfirmedRequest.Service.WhoIs} opts - request options
     * @return {Buffer}
     */
    static whoIs (opts: UnconfirmedRequest.Service.WhoIs): Buffer {
        // Generate APDU writer
        const writerUnconfirmReq = Layers.Writer.APDU.UnconfirmedRequest.writeHeader(opts);
        const writerWhoIs = Layers.Writer.APDU.UnconfirmedRequest.writeWhoIs(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerWhoIs);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
            func: Enums.BLVCFunction.originalBroadcastNPDU,
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
     * Creates the "iAm" unconfirmed request message.
     *
     * @static
     * @param  {UnconfirmedRequest.Service.IAm} opts - request options
     * @return {Buffer}
     */
    static iAm (opts: UnconfirmedRequest.Service.IAm): Buffer {
        // Generate APDU writer
        const writerUnconfirmReq = Layers.Writer.APDU.UnconfirmedRequest.writeHeader(opts);
        const writerIAm = Layers.Writer.APDU.UnconfirmedRequest.writeIAm(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerIAm);

        // Generate NPDU writer
        const writerNPDU = Layers.Writer.NPDU.writeLayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = Layers.Writer.BLVC.writeLayer({
            func: Enums.BLVCFunction.originalBroadcastNPDU,
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
     * Creates the "COV notification" unconfirmed request message.
     *
     * @static
     * @param  {UnconfirmedRequest.Service.COVNotification} opts - request options
     * @return {Buffer}
     */
    static covNotification (opts: UnconfirmedRequest.Service.COVNotification): Buffer {
        // Generate APDU writer
        const writerUnconfirmReq = Layers.Writer.APDU.UnconfirmedRequest.writeHeader(opts);
        const writerCOVNotification = Layers.Writer.APDU.UnconfirmedRequest.writeCOVNotification(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerCOVNotification);

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

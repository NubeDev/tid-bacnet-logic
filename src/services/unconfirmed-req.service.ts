import * as Enums from '../enums';

import { unconfirmedReqPDU } from '../layers/apdus';
import { blvc, npdu } from '../layers';

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
        const writerUnconfirmReq = unconfirmedReqPDU.writeReq(opts);
        const writerWhoIs = unconfirmedReqPDU.writeWhoIs(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerWhoIs);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
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
        const writerUnconfirmReq = unconfirmedReqPDU.writeReq(opts);
        const writerIAm = unconfirmedReqPDU.writeIAm(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerIAm);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
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
        const writerUnconfirmReq = unconfirmedReqPDU.writeReq(opts);
        const writerCOVNotification = unconfirmedReqPDU.writeCOVNotification(opts);
        const writerAPDU = IOs.Writer.concat(writerUnconfirmReq, writerCOVNotification);

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

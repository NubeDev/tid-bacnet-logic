import * as _ from 'lodash';

import { BACnetError } from '../errors';

import { BACnetReader } from '../io';

import {
    ConfirmedReqPDU,
    SimpleACKPDU,
    UnconfirmedReqPDU,
    ComplexACKPDU,
} from './apdus';

import * as Enums from '../enums';

import * as Interfaces from '../interfaces';

export class APDU {
    public readonly className: string = 'APDU';

    /**
     * getFromBuffer - parses the "APDU" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU" message
     * @return {ILayerAPDU}
     */
    public getFromBuffer (buf: Buffer): Interfaces.APDU.Read.Layer {
        const reader = new BACnetReader(buf);

        let APDUMessage: Interfaces.APDU.Read.Layer;
        try {
            const mType = reader.readUInt8();
            const pduType = (mType >> 4) & 0x0F

            let reqInst;
            switch (pduType) {
                case Enums.ServiceType.ConfirmedReqPDU: {
                    reqInst = new ConfirmedReqPDU();
                    break;
                }
                case Enums.ServiceType.UnconfirmedReqPDU: {
                    reqInst = new UnconfirmedReqPDU();
                    break;
                }
                case Enums.ServiceType.SimpleACKPDU: {
                    reqInst = new SimpleACKPDU();
                    break;
                }
                case Enums.ServiceType.ComplexACKPDU: {
                    reqInst = new ComplexACKPDU();
                    break;
                }
            }

            APDUMessage = reqInst.getFromBuffer(buf);
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        return APDUMessage;
    }
}

export const apdu: APDU = new APDU();

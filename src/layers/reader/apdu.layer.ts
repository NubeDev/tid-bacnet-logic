import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as IOs from '../../io';

import * as APDUs from './apdu';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import * as Utils from '../../utils';

export class APDU {
    static readonly className: string = 'APDU';

    /**
     * Parses the "APDU" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU" message
     * @return {ILayerAPDU}
     */
    static readLayer (reader: IOs.Reader): Interfaces.APDU.Read.Layer {
        let APDUMessage: Interfaces.APDU.Read.Layer;

        try {
            const mType = reader.readUInt8({ silent: true });
            const pduType = Utils.Typer.getBitRange(mType, 4, 4);

            let pduReader;
            switch (pduType) {
                case Enums.ServiceType.ConfirmedReqPDU: {
                    pduReader = APDUs.ConfirmedRequest;
                    break;
                }
                case Enums.ServiceType.UnconfirmedReqPDU: {
                    pduReader = APDUs.UnconfirmedRequest;
                    break;
                }
                case Enums.ServiceType.SimpleACKPDU: {
                    pduReader = APDUs.SimpleACK;
                    break;
                }
                case Enums.ServiceType.ComplexACKPDU: {
                    pduReader = APDUs.ComplexACK;
                    break;
                }
            }

            APDUMessage = pduReader.readLayer(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        return APDUMessage;
    }
}

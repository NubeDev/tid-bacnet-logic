import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class SimpleACK {
    static readonly className: string = 'SimpleACKPDU';

    /**
     * Parses the "APDU Simple ACK" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Simple ACK" message
     * @return {Interfaces.SimpleACK.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.SimpleACK.Read.Layer {
        let reqMap: Interfaces.SimpleACK.Read.Layer;
        let serviceChoice: Enums.ConfirmedServiceChoice, serviceData: Interfaces.SimpleACK.Read.ServiceChoice;
        let pduType: number, invokeId: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = Utils.Typer.getBitRange(mMeta, 4, 4);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.ConfirmedServiceChoice.SubscribeCOV:
                    serviceData = this.readSubscribeCOV(reader);
                    break;
                case Enums.ConfirmedServiceChoice.WriteProperty:
                    serviceData = this.readWriteProperty(reader);
                    break;
            }
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - readLayer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            invokeId: invokeId,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    /**
     * Parses the "APDU Simple ACK Subscribe CoV" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Simple ACK Subscribe CoV" message
     * @return {Interfaces.SimpleACK.Read.SubscribeCOV}
     */
    static readSubscribeCOV (reader: IOs.Reader): Interfaces.SimpleACK.Read.SubscribeCOV {
        const serviceMap: Interfaces.SimpleACK.Read.SubscribeCOV = {};

        return serviceMap;
    }

    /**
     * Parses the "APDU Simple ACK Write Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Simple ACK Subscribe CoV" message
     * @return {Interfaces.SimpleACK.Read.WriteProperty}
     */
    static readWriteProperty (reader: IOs.Reader): Interfaces.SimpleACK.Read.WriteProperty {
        const serviceMap: Interfaces.SimpleACK.Read.WriteProperty = {};

        return serviceMap;
    }
}

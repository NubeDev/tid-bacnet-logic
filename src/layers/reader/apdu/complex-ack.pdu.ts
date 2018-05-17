import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as Helpers from '../../../helpers';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class ComplexACK {
    static readonly className: string = 'ComplexACKPDU';

    /**
     * Parses the "APDU Complex ACK" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Complex ACK" message
     * @return {Interfaces.ComplexACK.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.ComplexACK.Read.Layer {
        let reqMap: Interfaces.ComplexACK.Read.Layer;
        let serviceChoice: Enums.ConfirmedServiceChoice;
        let serviceData: Interfaces.ComplexACK.Read.ServiceChoice;
        let pduType: number, pduSeg: boolean, pduMor: boolean;
        let invokeId: number, sequenceNumber: number, proposedWindowSize: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = Utils.Typer.getBitRange(mMeta, 4, 4);

            pduSeg = !!Utils.Typer.getBit(mMeta, 3);

            pduMor = !!Utils.Typer.getBit(mMeta, 2);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            if (pduSeg) {
                sequenceNumber = reader.readUInt8();

                proposedWindowSize = reader.readUInt8();
            }

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.ConfirmedServiceChoice.ReadProperty:
                    serviceData = this.readReadProperty(reader);
                    break;
            }
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - readLayer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            seg: pduSeg,
            mor: pduMor,
            invokeId: invokeId,
            sequenceNumber: sequenceNumber,
            proposedWindowSize: proposedWindowSize,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    /**
     * Parses the "APDU Complex ACK Read Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Complex ACK Read Property" message
     * @return {Interfaces.ComplexACK.Read.ReadProperty}
     */
    static readReadProperty (reader: IOs.Reader): Interfaces.ComplexACK.Read.ReadProperty {
        let serviceData: Interfaces.ComplexACK.Read.ReadProperty;

        let objId: BACnetTypes.BACnetObjectId;
        let prop: Interfaces.PropertyValue;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            prop = Helpers.Reader.readProperty(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - readProperty: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            prop: prop,
        };

        return serviceData;
    }
}

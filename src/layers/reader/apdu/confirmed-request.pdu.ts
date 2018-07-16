import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as Helpers from '../../../helpers';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class ConfirmedRequest {
    static readonly className: string = 'ConfirmedReqPDU';

    /**
     * Parses the "APDU Confirmed Request" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Confirmed Request" message
     * @return {Interfaces.ConfirmedRequest.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.Layer {
        let reqMap: Interfaces.ConfirmedRequest.Read.Layer;
        let serviceChoice: Enums.ConfirmedServiceChoice;
        let serviceData: Interfaces.ConfirmedRequest.Read.ServiceChoice;
        let pduType: number, pduSeg: boolean, pduMor: boolean, pduSa: boolean;
        let invokeId: number, sequenceNumber: number, proposedWindowSize: number;
        let maxResp: number, maxSegs: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = Utils.Typer.getBitRange(mMeta, 4, 4);

            pduSeg = !!Utils.Typer.getBit(mMeta, 3);

            pduMor = !!Utils.Typer.getBit(mMeta, 2);

            pduSa = !!Utils.Typer.getBit(mMeta, 1);

            // --- Read control byte
            const mControl = reader.readUInt8();

            maxSegs = Utils.Typer.getBitRange(mControl, 4, 3);

            maxResp = Utils.Typer.getBitRange(mControl, 0, 4);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            if (pduSeg) {
                sequenceNumber = reader.readUInt8();

                proposedWindowSize = reader.readUInt8();
            }

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.ConfirmedServiceChoice.SubscribeCOV:
                    serviceData = this.readSubscribeCOV(reader);
                    break;
                case Enums.ConfirmedServiceChoice.ReadProperty:
                    serviceData = this.readReadProperty(reader);
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
            seg: pduSeg,
            mor: pduMor,
            sa: pduSa,
            maxSegs: maxSegs,
            maxResp: maxResp,
            invokeId: invokeId,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    /**
     * Parses the "APDU Confirmed Request Read Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Read Property" message
     * @return {Interfaces.ConfirmedRequest.Read.ReadProperty}
     */
    static readReadProperty (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.ReadProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.ReadProperty;
        let objId: BACnetTypes.BACnetObjectId, propId: BACnetTypes.BACnetEnumerated;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            propId = BACnetTypes.BACnetEnumerated.readParam(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - readProperty: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            prop: {
                id: propId,
            },
        };

        return serviceData;
    }

    /**
     * Parses the "APDU Confirmed Request Subscribe CoV" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Subscribe CoV" message
     * @return {Interfaces.ConfirmedRequest.Read.SubscribeCOV}
     */
    static readSubscribeCOV (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.SubscribeCOV {
        let serviceData: Interfaces.ConfirmedRequest.Read.SubscribeCOV;
        let objId: BACnetTypes.BACnetObjectId,
            subscriberProcessId: BACnetTypes.BACnetUnsignedInteger,
            issConfNotif: BACnetTypes.BACnetBoolean,
            lifeTime: BACnetTypes.BACnetUnsignedInteger;

        try {
            subscriberProcessId = BACnetTypes.BACnetUnsignedInteger.readParam(reader);

            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            issConfNotif = BACnetTypes.BACnetBoolean.readParam(reader, { optional: true, tag: { num: 2, type: Enums.TagType.context } });

            lifeTime = BACnetTypes.BACnetUnsignedInteger.readParam(reader, { optional: true, tag: { num: 3, type: Enums.TagType.context } });
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - subscribeCOV: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            subProcessId: subscriberProcessId,
            issConfNotif: issConfNotif,
            lifetime: lifeTime,
        };

        return serviceData;
    }

    /**
     * Parses the "APDU Confirmed Request Write Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Write Property" message
     * @return {Interfaces.ConfirmedRequest.Read.WriteProperty}
     */
    static readWriteProperty (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.WriteProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.WriteProperty;
        let objId: BACnetTypes.BACnetObjectId;
        let prop: Interfaces.PropertyValue;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            prop = Helpers.Reader.readProperty(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - writeProperty: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            prop: prop,
        };

        return serviceData;
    }
}

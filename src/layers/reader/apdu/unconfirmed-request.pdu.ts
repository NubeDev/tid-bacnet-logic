import * as _ from 'lodash';

import * as Errors from '../../../errors';

import * as Utils from '../../../utils';

import * as IOs from '../../../io';

import * as Interfaces from '../../../interfaces';

import * as Enums from '../../../enums';

import * as BACnetTypes from '../../../types';

export class UnconfirmedRequest {
    static readonly className: string = 'UnconfirmedReqPDU';

    /**
     * Parses the "APDU Unconfirmed Request" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Unconfirmed Request" message
     * @return {Interfaces.UnconfirmedRequest.Read.Layer}
     */
    static readLayer (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.Layer {
        let reqMap: Interfaces.UnconfirmedRequest.Read.Layer;
        let serviceChoice: Enums.UnconfirmedServiceChoice;
        let serviceData: Interfaces.UnconfirmedRequest.Read.ServiceChoice;
        let pduType: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = Utils.Typer.getBitRange(mMeta, 4, 4);

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.UnconfirmedServiceChoice.iAm:
                    serviceData = this.readIAm(reader);
                    break;
                case Enums.UnconfirmedServiceChoice.whoIs:
                    serviceData = this.readWhoIs(reader);
                    break;
                case Enums.UnconfirmedServiceChoice.covNotification:
                    serviceData = this.readCOVNotification(reader);
                    break;
            }
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - readLayer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    /**
     * Parses the "APDU Unconfirmed Request I Am" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request I Am" message
     * @return {Interfaces.UnconfirmedRequest.Read.IAm}
     */
    static readIAm (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.IAm {
        let serviceData: Interfaces.UnconfirmedRequest.Read.IAm;
        let objId: BACnetTypes.BACnetObjectId,
            maxAPDUlength: BACnetTypes.BACnetUnsignedInteger,
            segmSupported: BACnetTypes.BACnetEnumerated,
            vendorId: BACnetTypes.BACnetUnsignedInteger;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            maxAPDUlength = BACnetTypes.BACnetUnsignedInteger.readParam(reader);

            segmSupported = BACnetTypes.BACnetEnumerated.readParam(reader);

            vendorId = BACnetTypes.BACnetUnsignedInteger.readParam(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - iAm: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            maxAPDUlength: maxAPDUlength,
            segmSupported: segmSupported,
            vendorId: vendorId,
        };

        return serviceData;
    }

    /**
     * Parses the "APDU Unconfirmed Request Who Is" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request Who Is" message
     * @return {Interfaces.UnconfirmedRequest.Read.WhoIs}
     */
    static readWhoIs (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.WhoIs {
        const serviceData: Interfaces.UnconfirmedRequest.Read.WhoIs = {};

        return serviceData;
    }

    /**
     * Parses the "APDU Unconfirmed Request COV Notification" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request COV Notification" message
     * @return {Interfaces.UnconfirmedRequest.Read.COVNotification}
     */
    static readCOVNotification (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.COVNotification {
        let serviceData: Interfaces.UnconfirmedRequest.Read.COVNotification;

        let subProcessId: BACnetTypes.BACnetUnsignedInteger;
        let devId: BACnetTypes.BACnetObjectId;
        let objId: BACnetTypes.BACnetObjectId;
        let timeRemaining: BACnetTypes.BACnetUnsignedInteger;
        let listOfValues: Interfaces.PropertyValue[];

        try {
            subProcessId = BACnetTypes.BACnetUnsignedInteger.readParam(reader);

            devId = BACnetTypes.BACnetObjectId.readParam(reader);

            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            timeRemaining = BACnetTypes.BACnetUnsignedInteger.readParam(reader);

            console.log(Utils);
            listOfValues = Utils.Reader.readProperties(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - covNotification: Parse - ${error}`);
        }

        serviceData = {
            subProcessId: subProcessId,
            devId: devId,
            objId: objId,
            timeRemaining: timeRemaining,
            listOfValues: listOfValues,
        };

        return serviceData;
    }
}

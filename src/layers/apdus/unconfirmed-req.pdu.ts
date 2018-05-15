import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import * as Utils from '../../utils';

import * as IOs from '../../io';

import * as Interfaces from '../../interfaces';

import * as Enums from '../../enums';

import * as BACnetTypes from '../../types';

export class UnconfirmedReqPDU {
    public readonly className: string = 'UnconfirmedReqPDU';

    /**
     * getFromBuffer - parses the "APDU Unconfirmed Request" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Unconfirmed Request" message
     * @return {Interfaces.UnconfirmedRequest.Read.Layer}
     */
    public getFromBuffer (buf: Buffer): Interfaces.UnconfirmedRequest.Read.Layer {
        const reader = new IOs.Reader(buf);

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
                    serviceData = this.getIAm(reader);
                    break;
                case Enums.UnconfirmedServiceChoice.whoIs:
                    serviceData = this.getWhoIs(reader);
                    break;
                case Enums.UnconfirmedServiceChoice.covNotification:
                    serviceData = this.getCOVNotification(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    /**
     * getIAm - parses the "APDU Unconfirmed Request I Am" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request I Am" message
     * @return {Interfaces.UnconfirmedRequest.Read.IAm}
     */
    private getIAm (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.IAm {
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
            throw new BACnetError(`${this.className} - getIAm: Parse - ${error}`);
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
     * getWhoIs - parses the "APDU Unconfirmed Request Who Is" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request Who Is" message
     * @return {Interfaces.UnconfirmedRequest.Read.WhoIs}
     */
    private getWhoIs (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.WhoIs {
        const serviceData: Interfaces.UnconfirmedRequest.Read.WhoIs = {};

        return serviceData;
    }

    /**
     * Parses the "APDU Unconfirmed Request COV Notification" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Unconfirmed Request COV Notification" message
     * @return {Interfaces.UnconfirmedRequest.Read.COVNotification}
     */
    private getCOVNotification (reader: IOs.Reader): Interfaces.UnconfirmedRequest.Read.COVNotification {
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

            listOfValues = Utils.Reader.readProperties(reader);
        } catch (error) {
            throw new BACnetError(`${this.className} - getCOVNotification: Parse - ${error}`);
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

    /**
     * writeReq - writes the "APDU Unconfirmed Request" header.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.Layer} params - "APDU Unconfirmed Request" write params
     * @return {IOs.Writer}
     */
    public writeReq (params: Interfaces.UnconfirmedRequest.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        const mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.UnconfirmedReqPDU, 4, 4);
        writer.writeUInt8(mMeta);

        return writer;
    }

    /**
     * writeWhoIs - writes the "APDU Unconfirmed Request Who Is" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.WhoIs} params - "APDU Unconfirmed Request Who Is" write params
     * @return {IOs.Writer}
     */
    public writeWhoIs (params: Interfaces.UnconfirmedRequest.Write.WhoIs): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.whoIs);

        return writer;
    }

    /**
     * writeIAm - writes the "APDU Unconfirmed Request I Am" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.IAm} params - "APDU Unconfirmed Request I Am" write params
     * @return {IOs.Writer}
     */
    public writeIAm (params: Interfaces.UnconfirmedRequest.Write.IAm): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.iAm);

        // Write Object identifier
        params.objId.writeValue(writer);

        // Write maxAPDUlength (1476 chars)
        const maxAPDUlength = new BACnetTypes.BACnetUnsignedInteger(0x05c4);
        maxAPDUlength.writeValue(writer);

        // Write Segmentation supported
        const segmSupported = new BACnetTypes.BACnetEnumerated(0x00);
        segmSupported.writeValue(writer);

        // Write Vendor ID
        params.vendorId.writeValue(writer);

        return writer;
    }

    /**
     * writeCOVNotification - writes the "APDU Unconfirmed Request CoV Notification" message.
     *
     * @param  {Interfaces.UnconfirmedRequest.Write.COVNotification} params - "APDU Unconfirmed Request CoV Notification" write params
     * @return {IOs.Writer}
     */
    public writeCOVNotification (params: Interfaces.UnconfirmedRequest.Write.COVNotification): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.UnconfirmedServiceChoice.covNotification);

        // Write Process Identifier
        params.subProcessId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Object Identifier for master Object
        params.devId.writeParam(writer, { num: 1, type: Enums.TagType.context });

        // Write Object Identifier for slave Object
        params.objId.writeParam(writer, { num: 2, type: Enums.TagType.context });

        // Write timer remaining
        if (params.timeRemaining) {
            params.timeRemaining.writeParam(writer, { num: 3, type: Enums.TagType.context });
        } else {
            const timeRemaining = new BACnetTypes.BACnetUnsignedInteger(0x00);
            timeRemaining.writeParam(writer, { num: 3, type: Enums.TagType.context });
        }

        Utils.Writer.writeProperties(writer, params.listOfValues, { num: 4, type: Enums.TagType.context });

        return writer;
    }
}

export const unconfirmedReqPDU: UnconfirmedReqPDU = new UnconfirmedReqPDU();

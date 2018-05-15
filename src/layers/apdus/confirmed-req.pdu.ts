import * as _ from 'lodash';

import * as Errors from '../../errors';

import * as Utils from '../../utils';

import * as IOs from '../../io';

import * as Interfaces from '../../interfaces';

import * as Enums from '../../enums';

import * as BACnetTypes from '../../types';

export class ConfirmedReqPDU {
    public readonly className: string = 'ConfirmedReqPDU';

    /**
     * getFromBuffer - parses the "APDU Confirmed Request" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Confirmed Request" message
     * @return {Interfaces.ConfirmedRequest.Read.Layer}
     */
    public getFromBuffer (buf: Buffer): Interfaces.ConfirmedRequest.Read.Layer {
        const reader = new IOs.Reader(buf);

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
                    serviceData = this.getSubscribeCOV(reader);
                    break;
                case Enums.ConfirmedServiceChoice.ReadProperty:
                    serviceData = this.getReadProperty(reader);
                    break;
                case Enums.ConfirmedServiceChoice.WriteProperty:
                    serviceData = this.getWriteProperty(reader);
                    break;
            }
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getFromBuffer: Parse - ${error}`);
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
     * getReadProperty - parses the "APDU Confirmed Request Read Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Read Property" message
     * @return {Interfaces.ConfirmedRequest.Read.ReadProperty}
     */
    private getReadProperty (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.ReadProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.ReadProperty;
        let objId: BACnetTypes.BACnetObjectId, propId: BACnetTypes.BACnetEnumerated;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            propId = BACnetTypes.BACnetEnumerated.readParam(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getReadProperty: Parse - ${error}`);
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
     * getSubscribeCOV - parses the "APDU Confirmed Request Subscribe CoV" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Subscribe CoV" message
     * @return {Interfaces.ConfirmedRequest.Read.SubscribeCOV}
     */
    private getSubscribeCOV (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.SubscribeCOV {
        let serviceData: Interfaces.ConfirmedRequest.Read.SubscribeCOV;
        let objId: BACnetTypes.BACnetObjectId,
            subscriberProcessId: BACnetTypes.BACnetUnsignedInteger,
            issConfNotif: BACnetTypes.BACnetBoolean,
            lifeTime: BACnetTypes.BACnetUnsignedInteger;

        try {
            subscriberProcessId = BACnetTypes.BACnetUnsignedInteger.readParam(reader);

            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            issConfNotif = BACnetTypes.BACnetBoolean.readParam(reader, { optional: true });

            lifeTime = BACnetTypes.BACnetUnsignedInteger.readParam(reader, { optional: true });
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getSubscribeCOV: Parse - ${error}`);
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
     * getWriteProperty - parses the "APDU Confirmed Request Write Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Confirmed Request Write Property" message
     * @return {Interfaces.ConfirmedRequest.Read.WriteProperty}
     */
    private getWriteProperty (reader: IOs.Reader): Interfaces.ConfirmedRequest.Read.WriteProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.WriteProperty;
        let objId: BACnetTypes.BACnetObjectId;
        let prop: Interfaces.PropertyValue;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            prop = Utils.Reader.readProperty(reader);
        } catch (error) {
            throw new Errors.BACnet(`${this.className} - getWriteProperty: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            prop: prop,
        };

        return serviceData;
    }

    /**
     * writeReq - writes the "APDU Confirmed Request" header.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.Layer} params - "APDU Confirmed Request" write params
     * @return {IOs.Writer}
     */
    public writeReq (params: Interfaces.ConfirmedRequest.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        let mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.ConfirmedReqPDU, 4, 4);
        mMeta = Utils.Typer.setBit(mMeta, 1, params.segAccepted || false);
        writer.writeUInt8(mMeta);

        // Write max response size
        writer.writeUInt8(0x05);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * writeReadProperty - writes the "APDU Confirmed Request Read Property" message.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.ReadProperty} params - "APDU Confirmed Request Read Property" write params
     * @return {IOs.Writer}
     */
    public writeReadProperty (params: Interfaces.ConfirmedRequest.Write.ReadProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.ReadProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.TagType.context });
        }

        return writer;
    }

    /**
     * writeWriteProperty - writes the "APDU Confirmed Request Write Property" message.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.WriteProperty} params - "APDU Confirmed Request Write Property" write params
     * @return {IOs.Writer}
     */
    public writeWriteProperty (params: Interfaces.ConfirmedRequest.Write.WriteProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.WriteProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.TagType.context });
        }

        // Write Property Value
        Utils.Writer.writeValue(writer, params.prop.values, { num: 3, type: Enums.TagType.context });

        if (params.prop.priority) {
            // Write Property Priority
            params.prop.priority.writeParam(writer, { num: 4, type: Enums.TagType.context });
        }

        return writer;
    }

    /**
     * writeSubscribeCOV - writes the "APDU Confirmed Request Subscribe CoV" message
     * to subscribe or re-subscribe to the CoV events.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.SubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    public writeSubscribeCOV (params: Interfaces.ConfirmedRequest.Write.SubscribeCOV): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.SubscribeCOV);

        // Write Subscriber Process Identifier
        params.subProcessId.writeParam(writer, { num: 0, type: Enums.TagType.context });

        // Monitored Object Identifier
        params.objId.writeParam(writer, { num: 1, type: Enums.TagType.context });

        if (_.isNil(params.issConfNotif)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.issConfNotif.writeParam(writer, { num: 2, type: Enums.TagType.context });

        if (_.isNil(params.lifetime)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.lifetime.writeParam(writer, { num: 3, type: Enums.TagType.context });

        return writer;
    }

    /**
     * writeUnsubscribeCOV - writes the "APDU Confirmed Request Subscribe CoV" message
     * to cancel the CoV subscription.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.UnsubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    public writeUnsubscribeCOV (params: Interfaces.ConfirmedRequest.Write.UnsubscribeCOV): IOs.Writer {
        return this.writeSubscribeCOV(params as Interfaces.ConfirmedRequest.Write.SubscribeCOV);
    }
}

export const confirmedReqPDU: ConfirmedReqPDU = new ConfirmedReqPDU();

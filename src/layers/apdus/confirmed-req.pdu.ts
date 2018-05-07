import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import { TyperUtil, BACnetReaderUtil, BACnetWriterUtil } from '../../utils';

import { BACnetReader, BACnetWriter } from '../../io';

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
        const reader = new BACnetReader(buf);

        let reqMap: Interfaces.ConfirmedRequest.Read.Layer;
        let serviceChoice: Enums.BACnet.ConfirmedServiceChoice;
        let serviceData: Interfaces.ConfirmedRequest.Read.ServiceChoice;
        let pduType: number, pduSeg: boolean, pduMor: boolean, pduSa: boolean;
        let invokeId: number, sequenceNumber: number, proposedWindowSize: number;
        let maxResp: number, maxSegs: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = TyperUtil.getBitRange(mMeta, 4, 4);

            pduSeg = !!TyperUtil.getBit(mMeta, 3);

            pduMor = !!TyperUtil.getBit(mMeta, 2);

            pduSa = !!TyperUtil.getBit(mMeta, 1);

            // --- Read control byte
            const mControl = reader.readUInt8();

            maxSegs = TyperUtil.getBitRange(mControl, 4, 3);

            maxResp = TyperUtil.getBitRange(mControl, 0, 4);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            if (pduSeg) {
                sequenceNumber = reader.readUInt8();

                proposedWindowSize = reader.readUInt8();
            }

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.BACnet.ConfirmedServiceChoice.SubscribeCOV:
                    serviceData = this.getSubscribeCOV(reader);
                    break;
                case Enums.BACnet.ConfirmedServiceChoice.ReadProperty:
                    serviceData = this.getReadProperty(reader);
                    break;
                case Enums.BACnet.ConfirmedServiceChoice.WriteProperty:
                    serviceData = this.getWriteProperty(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
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
     * @param  {BACnetReader} reader - BACnet reader with "APDU Confirmed Request Read Property" message
     * @return {Interfaces.ConfirmedRequest.Read.ReadProperty}
     */
    private getReadProperty (reader: BACnetReader): Interfaces.ConfirmedRequest.Read.ReadProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.ReadProperty;
        let objId: BACnetTypes.BACnetObjectId, propId: BACnetTypes.BACnetEnumerated;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            propId = BACnetTypes.BACnetEnumerated.readParam(reader);
        } catch (error) {
            throw new BACnetError(`${this.className} - getReadProperty: Parse - ${error}`);
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
     * @param  {BACnetReader} reader - BACnet reader with "APDU Confirmed Request Subscribe CoV" message
     * @return {Interfaces.ConfirmedRequest.Read.SubscribeCOV}
     */
    private getSubscribeCOV (reader: BACnetReader): Interfaces.ConfirmedRequest.Read.SubscribeCOV {
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
            throw new BACnetError(`${this.className} - getSubscribeCOV: Parse - ${error}`);
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
     * @param  {BACnetReader} reader - BACnet reader with "APDU Confirmed Request Write Property" message
     * @return {Interfaces.ConfirmedRequest.Read.WriteProperty}
     */
    private getWriteProperty (reader: BACnetReader): Interfaces.ConfirmedRequest.Read.WriteProperty {
        let serviceData: Interfaces.ConfirmedRequest.Read.WriteProperty;
        let objId: BACnetTypes.BACnetObjectId;
        let prop: Interfaces.BACnet.PropertyValue;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            prop = BACnetReaderUtil.readProperty(reader);
        } catch (error) {
            throw new BACnetError(`${this.className} - getWriteProperty: Parse - ${error}`);
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
     * @return {BACnetWriter}
     */
    public writeReq (params: Interfaces.ConfirmedRequest.Write.Layer): BACnetWriter {
        const writer = new BACnetWriter();

        // Write Service Type
        let mMeta = TyperUtil.setBitRange(0x00,
            Enums.BACnet.ServiceType.ConfirmedReqPDU, 4, 4);
        mMeta = TyperUtil.setBit(mMeta, 1, params.segAccepted || false);
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
     * @return {BACnetWriter}
     */
    public writeReadProperty (params: Interfaces.ConfirmedRequest.Write.ReadProperty): BACnetWriter {
        const writer = new BACnetWriter();

        // Write Service choice
        writer.writeUInt8(Enums.BACnet.ConfirmedServiceChoice.ReadProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.BACnet.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.BACnet.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.BACnet.TagType.context });
        }

        return writer;
    }

    /**
     * writeWriteProperty - writes the "APDU Confirmed Request Write Property" message.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.WriteProperty} params - "APDU Confirmed Request Write Property" write params
     * @return {BACnetWriter}
     */
    public writeWriteProperty (params: Interfaces.ConfirmedRequest.Write.WriteProperty): BACnetWriter {
        const writer = new BACnetWriter();

        // Write Service choice
        writer.writeUInt8(Enums.BACnet.ConfirmedServiceChoice.WriteProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.BACnet.TagType.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.BACnet.TagType.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.BACnet.TagType.context });
        }

        // Write Property Value
        BACnetWriterUtil.writeValue(writer, params.prop.values, { num: 3, type: Enums.BACnet.TagType.context });

        if (params.prop.priority) {
            // Write Property Priority
            params.prop.priority.writeParam(writer, { num: 4, type: Enums.BACnet.TagType.context });
        }

        return writer;
    }

    /**
     * writeSubscribeCOV - writes the "APDU Confirmed Request Subscribe CoV" message
     * to subscribe or re-subscribe to the CoV events.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.SubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {BACnetWriter}
     */
    public writeSubscribeCOV (params: Interfaces.ConfirmedRequest.Write.SubscribeCOV): BACnetWriter {
        const writer = new BACnetWriter();

        // Write Service choice
        writer.writeUInt8(Enums.BACnet.ConfirmedServiceChoice.SubscribeCOV);

        // Write Subscriber Process Identifier
        params.subProcessId.writeParam(writer, { num: 0, type: Enums.BACnet.TagType.context });

        // Monitored Object Identifier
        params.objId.writeParam(writer, { num: 1, type: Enums.BACnet.TagType.context });

        if (_.isNil(params.issConfNotif)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.issConfNotif.writeParam(writer, { num: 2, type: Enums.BACnet.TagType.context });

        if (_.isNil(params.lifetime)) {
            return writer;
        }

        // Issue Confirmed Notifications
        params.lifetime.writeParam(writer, { num: 3, type: Enums.BACnet.TagType.context });

        return writer;
    }

    /**
     * writeUnsubscribeCOV - writes the "APDU Confirmed Request Subscribe CoV" message
     * to cancel the CoV subscription.
     *
     * @param  {Interfaces.ConfirmedRequest.Write.UnsubscribeCOV} params - "APDU Confirmed Request Subscribe CoV" write params
     * @return {BACnetWriter}
     */
    public writeUnsubscribeCOV (params: Interfaces.ConfirmedRequest.Write.UnsubscribeCOV): BACnetWriter {
        return this.writeSubscribeCOV(params as Interfaces.ConfirmedRequest.Write.SubscribeCOV);
    }
}

export const confirmedReqPDU: ConfirmedReqPDU = new ConfirmedReqPDU();

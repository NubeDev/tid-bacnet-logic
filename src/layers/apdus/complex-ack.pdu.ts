import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import { TyperUtil, BACnetReaderUtil, BACnetWriterUtil } from '../../utils';

import { BACnetReader, BACnetWriter } from '../../io';

import * as Interfaces from '../../interfaces';

import * as Enums from '../../enums';

import * as BACnetTypes from '../../types';

export class ComplexACKPDU {
    public readonly className: string = 'ComplexACKPDU';

    /**
     * getFromBuffer - parses the "APDU Complex ACK" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Complex ACK" message
     * @return {Interfaces.ComplexACK.Read.Layer}
     */
    private getFromBuffer (buf: Buffer): Interfaces.ComplexACK.Read.Layer {
        const reader = new BACnetReader(buf);

        let reqMap: Interfaces.ComplexACK.Read.Layer;
        let serviceChoice: Enums.BACnetConfirmedService, serviceData: Interfaces.ComplexACK.Read.ServiceChoice;
        let pduType: number, pduSeg: boolean, pduMor: boolean;
        let invokeId: number, sequenceNumber: number, proposedWindowSize: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = TyperUtil.getBitRange(mMeta, 4, 4);

            pduSeg = !!TyperUtil.getBit(mMeta, 3);

            pduMor = !!TyperUtil.getBit(mMeta, 2);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            if (pduSeg) {
                sequenceNumber = reader.readUInt8();

                proposedWindowSize = reader.readUInt8();
            }

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case Enums.BACnetConfirmedService.ReadProperty:
                    serviceData = this.getReadProperty(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
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
     * getReadProperty - parses the "APDU Complex ACK Read Property" message.
     *
     * @param  {BACnetReader} reader - BACnet reader with "APDU Complex ACK Read Property" message
     * @return {Interfaces.ComplexACK.Read.ReadProperty}
     */
    private getReadProperty (reader: BACnetReader): Interfaces.ComplexACK.Read.ReadProperty {
        let serviceData: Interfaces.ComplexACK.Read.ReadProperty;

        let objId: BACnetTypes.BACnetObjectId;
        let prop: Interfaces.IBACnetPropertyValue;

        try {
            objId = BACnetTypes.BACnetObjectId.readParam(reader);

            prop = BACnetReaderUtil.readProperty(reader);
        } catch (error) {
            throw new BACnetError(`${this.className} - getReadProperty: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            prop: prop,
        };

        return serviceData;
    }

    /**
     * writeReq - writes the "APDU Complex ACK" header.
     *
     * @param  {Interfaces.ComplexACK.Write.Layer} params - "APDU Complex ACK" write params
     * @return {BACnetWriter}
     */
    public writeReq (params: Interfaces.ComplexACK.Write.Layer): BACnetWriter {
        const writer = new BACnetWriter();

        // Write service meta
        // Set service type
        let mMeta = TyperUtil.setBitRange(0x00,
            Enums.BACnetServiceTypes.ComplexACKPDU, 4, 4);

        // Set service SEG flag
        if (!_.isNil(params.seg)) {
            mMeta = TyperUtil.setBit(mMeta, 3, params.seg);
        }

        // Set service MOR flag
        if (!_.isNil(params.mor)) {
            mMeta = TyperUtil.setBit(mMeta, 2, params.mor);
        }

        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * writeReq - writes the "APDU Complex ACK Read Property" message.
     *
     * @param  {Interfaces.ComplexACK.Write.ReadProperty} params - "APDU Complex ACK Read Property" write params
     * @return {BACnetWriter}
     */
    public writeReadProperty (params: Interfaces.ComplexACK.Write.ReadProperty): BACnetWriter {
        const writer = new BACnetWriter();

        // Write Service choice
        writer.writeUInt8(Enums.BACnetConfirmedService.ReadProperty);

        // Write Object identifier
        params.objId.writeParam(writer, { num: 0, type: Enums.BACnetTagTypes.context });

        // Write Property ID
        params.prop.id.writeParam(writer, { num: 1, type: Enums.BACnetTagTypes.context });

        if (params.prop.index) {
            // Write Property Array Index
            params.prop.index.writeParam(writer, { num: 2, type: Enums.BACnetTagTypes.context });
        }

        // Write Property Value
        BACnetWriterUtil.writeValue(writer, params.prop.values, { num: 3, type: Enums.BACnetTagTypes.context });

        return writer;
    }
}

export const complexACKPDU: ComplexACKPDU = new ComplexACKPDU();

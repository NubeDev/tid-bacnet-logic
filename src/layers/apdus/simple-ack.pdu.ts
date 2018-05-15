import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import * as Utils from '../../utils';

import * as IOs from '../../io';

import * as Interfaces from '../../interfaces';

import * as Enums from '../../enums';

import * as BACnetTypes from '../../types';

export class SimpleACKPDU {
    public readonly className: string = 'SimpleACKPDU';

    /**
     * getFromBuffer - parses the "APDU Simple ACK" message.
     *
     * @param  {Buffer} buf - js Buffer with "APDU Simple ACK" message
     * @return {Interfaces.SimpleACK.Read.Layer}
     */
    public getFromBuffer (buf: Buffer): Interfaces.SimpleACK.Read.Layer {
        const reader = new IOs.Reader(buf);

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
                    serviceData = this.getSubscribeCOV(reader);
                    break;
                case Enums.ConfirmedServiceChoice.WriteProperty:
                    serviceData = this.getWriteProperty(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
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
     * getSubscribeCOV - parses the "APDU Simple ACK Subscribe CoV" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Simple ACK Subscribe CoV" message
     * @return {Interfaces.SimpleACK.Read.SubscribeCOV}
     */
    private getSubscribeCOV (reader: IOs.Reader): Interfaces.SimpleACK.Read.SubscribeCOV {
        const serviceMap: Interfaces.SimpleACK.Read.SubscribeCOV = {};

        return serviceMap;
    }

    /**
     * getSubscribeCOV - parses the "APDU Simple ACK Write Property" message.
     *
     * @param  {IOs.Reader} reader - BACnet reader with "APDU Simple ACK Subscribe CoV" message
     * @return {Interfaces.SimpleACK.Read.WriteProperty}
     */
    private getWriteProperty (reader: IOs.Reader): Interfaces.SimpleACK.Read.WriteProperty {
        const serviceMap: Interfaces.SimpleACK.Read.WriteProperty = {};

        return serviceMap;
    }

    /**
     * writeReq - writes the "APDU Simple ACK" header.
     *
     * @param  {Interfaces.SimpleACK.Write.Layer} params - "APDU Simple ACK" write params
     * @return {IOs.Writer}
     */
    public writeReq (params: Interfaces.SimpleACK.Write.Layer): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service Type
        const mMeta = Utils.Typer.setBitRange(0x00,
            Enums.ServiceType.SimpleACKPDU, 4, 4);
        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * writeSubscribeCOV - writes the "APDU Simple ACK Subscribe CoV" message.
     *
     * @param  {Interfaces.SimpleACK.Write.SubscribeCOV} params - "APDU Simple ACK Subscribe CoV" write params
     * @return {IOs.Writer}
     */
    public writeSubscribeCOV (params: Interfaces.SimpleACK.Write.SubscribeCOV): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.SubscribeCOV);

        return writer;
    }

    /**
     * writeWriteProperty - writes the "APDU Simple ACK Write Property" message.
     *
     * @param  {Interfaces.SimpleACK.Write.WriteProperty} params - "APDU Simple ACK Write Property" write params
     * @return {IOs.Writer}
     */
    public writeWriteProperty (params: Interfaces.SimpleACK.Write.WriteProperty): IOs.Writer {
        const writer = new IOs.Writer();

        // Write Service choice
        writer.writeUInt8(Enums.ConfirmedServiceChoice.WriteProperty);

        return writer;
    }
}

export const simpleACKPDU: SimpleACKPDU = new SimpleACKPDU();

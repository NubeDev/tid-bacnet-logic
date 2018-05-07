import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import { BACnetReader, BACnetWriter } from '../../io';

export class BACnetNull extends BACnetTypeBase {
    public readonly className: string = 'BACnetNull';
    public readonly type: BACnetPropTypes = BACnetPropTypes.nullData;

    protected tag: Interfaces.BACnet.Tag;

    constructor () {
        super();
    }

    static readParam (reader: BACnetReader, opts?: Interfaces.BACnet.ReaderOptions): BACnetNull {
        return super.readParam(reader, opts);
    }

    /**
     * readValue - parses the message with BACnet "null" value.
     *
     * @param  {BACnetReader} reader - BACnet reader with "null" BACnet value
     * @param  {type} [opts = true] - change offset in the buffer of reader
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.BACnet.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;
    }

    /**
     * writeValue - writes the BACnet "null" value.
     *
     * @param  {BACnetWriter} writer - BACnet writer
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void {
        writer.writeTag(BACnetPropTypes.nullData, 0, 0);
    }

    /**
     * writeParam - writes the BACnet Param as "null" value.
     *
     * @param  {BACnetWriter} writer - BACnet writer
     * @param  {Interfaces.BACnet.Tag} tag - BACnet tag
     * @return {void}
     */
    public writeParam (writer: BACnetWriter, tag: Interfaces.BACnet.Tag): void {
        const dataSize: number = 1;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "null" value
        writer.writeUIntValue(0);
    }

    /**
     * setValue - sets the new BACnet "null" value as internal state.
     *
     * @param  {null} newValue - new "null" value
     * @return {void}
     */
    public setValue (newValue: null): void {
    }

    /**
     * getValue - returns the internal state as current BACnet "null" value.
     *
     * @return {null}
     */
    public getValue (): null {
        return null;
    }

    /**
     * value - sets the new BACnet "null" value as internal state
     *
     * @type {null}
     */
    public set value (newValue: null) {
        this.setValue(newValue);
    }

    /**
     * value - returns the internal state as current BACnet "null" value.
     *
     * @type {null}
     */
    public get value (): null {
        return this.getValue();
    }
}

import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import * as Errors from '../../errors';

import * as IOs from '../../io';

export class BACnetNull extends BACnetTypeBase {
    public readonly className: string = 'BACnetNull';
    public readonly type: Enums.PropertyType = Enums.PropertyType.nullData;

    protected tag: Interfaces.Tag;

    constructor () {
        super();
    }

    /**
     * Creates the instance of the BACnetNull and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetNull}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetNull {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `null` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;
    }

    /**
     * Writes the BACnet `null` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        writer.writeTag(Enums.PropertyType.nullData, 0, 0);
    }

    /**
     * Writes the BACnet `null` as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        const dataSize: number = 1;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "null" value
        writer.writeUIntValue(0);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {null} newValue - new value
     * @return {void}
     */
    public setValue (newValue: null): void {
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {null}
     */
    public getValue (): null {
        return null;
    }

    /**
     * `null` value
     *
     * @type {number}
     */
    public set value (newValue: null) {
        this.setValue(newValue);
    }
    /**
     * @type {null}
     */
    public get value (): null {
        return this.getValue();
    }
}

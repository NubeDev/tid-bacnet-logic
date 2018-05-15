import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import * as IOs from '../../io';

export class BACnetReal extends BACnetTypeBase {
    public readonly className: string = 'BACnetReal';
    public readonly type: Enums.PropertyType = Enums.PropertyType.real;

    protected tag: Interfaces.Tag;
    protected data: number;

    constructor (defValue?: number) {
        super();

        this.data = _.isUndefined(defValue)
            ? 0 : this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetReal and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetReal}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetReal {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `real` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        let value: number = reader.readFloatBE(opts);
        this.data = this.toFixed(value);
    }

    /**
     * Writes the BACnet `real` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        this.writeParam(writer, {
            num: Enums.PropertyType.real,
            type: Enums.TagType.application,
        });
    }

    /**
     * Writes the BACnet `real` as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        const dataSize: number = 4;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "real" value
        writer.writeFloatBE(this.data)
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {number} newValue - new value
     * @return {void}
     */
    public setValue (newValue: number): void {
        this.data = this.checkAndGetValue(newValue);
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {number}
     */
    public getValue (): number {
        return this.data;
    }

    /**
     * `real` value
     *
     * @type {number}
     */
    public set value (newValue: number) {
        this.setValue(newValue);
    }
    /**
     * @type {number}
     */
    public get value (): number {
        return this.getValue();
    }

    /**
     * Returns `true` if "value" is a correct "real" value, throws
     * the error if "value" has incorrect type.
     *
     * @param  {number} value - "real" value
     * @return {number}
     */
    private checkAndGetValue (value: number): number {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            throw new BACnetError('BACnetReal - updateValue: Value must be of type "real"!');
        }

        return this.toFixed(value);
    }

    /**
     * HELPERs
     */

    private toFixed (value: number): number {
        return +value.toFixed(4);
    }
}

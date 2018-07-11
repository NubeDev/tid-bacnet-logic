import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import * as Errors from '../../errors';

import * as IOs from '../../io';

export class BACnetUnsignedInteger extends BACnetTypeBase {
    public readonly className: string = 'BACnetUnsignedInteger';
    public readonly type: Enums.PropertyType = Enums.PropertyType.unsignedInt;

    protected tag: Interfaces.Tag;
    protected data: number;

    constructor (defValue?: number) {
        super();

        this.data = _.isUndefined(defValue)
            ? 0 : this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetUnsignedInteger and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetUnsignedInteger}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetUnsignedInteger {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `unsigned integer` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        let value: number;
        switch (tag.value) {
            case 1:
                value = reader.readUInt8(opts);
                break;
            case 2:
                value = reader.readUInt16BE(opts);
                break;
            case 4:
                value = reader.readUInt32BE(opts);
                break;
            default:
                value = reader.readUIntBE(tag.value, opts)
        }

        this.data = value;
    }

    /**
     * Writes the BACnet `unsigned integer` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        this.writeParam(writer, {
            num: Enums.PropertyType.unsignedInt,
            type: Enums.TagType.application,
        });
    }

    /**
     * Writes the BACnet `unsigned integer` as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        const dataSize = this.getUIntSize(this.data);
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "unsigned integer" value
        writer.writeUIntValue(this.data);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {number} newValue - new value
     * @return {void}
     */
    public setValue (newValue: number): void {
        this.data = newValue;
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
     * `unsigned integer` value
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
     * Performs a comparison between current BACnet value and `data` to determine if
     * they are equivalent.
     *
     * @param  {number|BACnetUnsignedInteger} data - data for comparison
     * @return {boolean} - result of the comparison
     */
    public isEqual (data: number|BACnetUnsignedInteger): boolean {
        if (_.isNil(data)) {
            return false;
        }

        if (typeof data === `number`) {
            return this.value === data;
        }

        if (data instanceof BACnetUnsignedInteger) {
            return this.value === data.value;
        }

        return false;
    }

    /**
     * HELPERs
     */

    /**
     * Returns the size (byte) of the unsigned int value.
     *
     * @param  {number} uIntValue - unsigned int value
     * @return {number}
     */
    public getUIntSize (uIntValue: number): number {
        if (uIntValue <= Enums.OpertionMaxValue.uInt8) {
            return 1;
        } else if (uIntValue <= Enums.OpertionMaxValue.uInt16) {
            return 2;
        } else if (uIntValue <= Enums.OpertionMaxValue.uInt32) {
            return 4;
        }
    }

    /**
     * Returns `true` if "value" is a correct "unsigned integer" value. Throws
     * the error if "value" has incorrect type.
     *
     * @param  {number} value - "unsigned integer" value
     * @return {number}
     */
    private checkAndGetValue (value: number): number {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            throw new Errors.BACnet('BACnetUnsignedInteger - updateValue: Value must be of type "unsigned integer"!');
        }

        return value;
    }
}

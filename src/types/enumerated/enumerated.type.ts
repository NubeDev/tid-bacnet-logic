import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import { BACnetReader, BACnetWriter } from '../../io';

export class BACnetEnumerated extends BACnetTypeBase {
    public readonly className: string = 'BACnetEnumerated';
    public readonly type: Enums.PropertyType = Enums.PropertyType.enumerated;

    protected tag: Interfaces.Tag;
    protected data: number;

    constructor (defValue?: number) {
        super();

        this.data = _.isUndefined(defValue)
            ? 0 : this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetEnumerated and calls the `readValue`
     * method.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetEnumerated}
     */
    static readParam (reader: BACnetReader, opts?: Interfaces.ReaderOptions): BACnetEnumerated {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `enumerated` value.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        const value: number = reader.readUInt8(opts)
        this.data = value;
    }

    /**
     * Writes the BACnet `enumerated` as BACnet value.
     *
     * @param  {BACnetWriter} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void {
        this.writeParam(writer, {
            num: Enums.PropertyType.enumerated,
            type: Enums.TagType.application,
        });
    }

    /**
     * Writes the BACnet `enumerated` as BACnet property (param).
     *
     * @param  {BACnetWriter} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: BACnetWriter, tag: Interfaces.Tag): void {
        const dataSize: number = 1;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "enumerated" value
        writer.writeUInt8(this.data);
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
     * `enumerated` value
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
     * @param  {number|BACnetEnumerated} data - data for comparison
     * @return {boolean} - result of the comparison
     */
    public isEqual (data: number|BACnetEnumerated): boolean {
        if (_.isNil(data)) {
            return false;
        }

        if (typeof data === `number`) {
            return this.value === data;
        }

        if (data instanceof BACnetEnumerated) {
            return this.value === data.value;
        }

        return false;
    }

    /**
     * Returns `true` if "value" is a correct "enumerated" value, throws
     * the error if "value" has incorrect type.
     *
     * @param  {number} value - "enumerated" value
     * @return {number}
     */
    private checkAndGetValue (value: number): number {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            throw new BACnetError('BACnetEnumerated - updateValue: Value must be of type "enumerated"!');
        }

        return value;
    }
}

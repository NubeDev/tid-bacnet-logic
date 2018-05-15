import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import * as IOs from '../../io';

export class BACnetCharacterString extends BACnetTypeBase {
    public readonly className: string = 'BACnetCharacterString';
    public readonly type: Enums.PropertyType = Enums.PropertyType.characterString;

    protected tag: Interfaces.Tag;
    private encoding: string;
    protected data: string;

    constructor (defValue?: string) {
        super();

        this.data = _.isUndefined(defValue)
            ? '' : this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetCharacterString and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetCharacterString}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetCharacterString {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `character string` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        const strLen = reader.readUInt8(opts);
        const charSet = reader.readUInt8(opts);

        // Get the character encoding
        const charEncode = this.getStringEncode(charSet);
        this.encoding = charEncode;

        const value = reader.readString(charEncode, strLen - 1, opts);
        this.data = value;
    }

    /**
     * Writes the BACnet `character string` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        // DataType - Application tag - Extended value (5)
        writer.writeTag(Enums.PropertyType.characterString, 0, 5);

        // Write lenght
        const paramValueLen = this.data.length + 1;
        writer.writeUInt8(paramValueLen);

        // Write "ansi" / "utf8" encoding
        writer.writeUInt8(0x00);

        // Write string
        writer.writeString(this.data);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {string} newValue - new value
     * @return {void}
     */
    public setValue (newValue: string): void {
        this.data = this.checkAndGetValue(newValue);
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {string}
     */
    public getValue (): string {
        return this.data;
    }

    /**
     * `character string` value
     *
     * @type {number}
     */
    public set value (newValue: string) {
        this.setValue(newValue);
    }
    /**
     * @type {number}
     */
    public get value (): string {
        return this.getValue();
    }

    /**
     * HELPERs
     */

    /**
     * Returns `true` if "value" is a correct "character string" value, throws
     * the error if "value" has incorrect type.
     *
     * @param  {string} value - "character string" value
     * @return {string}
     */
    private checkAndGetValue (value: string): string {
        if (!_.isString(value)) {
            throw new BACnetError('BACnetCharacterString - updateValue: Value must be of type "character string"!');
        }

        return value;
    }

    /**
     * Returns the "string" representation of the character
     * encoding.
     *
     * @param  {number} charSet - character encoding
     * @return {string}
     */
    private getStringEncode (charSet: number): string {
        switch (charSet) {
            case 0:
            default:
                return 'utf8';
        }
    }
}

import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import {
    TyperUtil,
} from '../../utils';

import { BACnetReader, BACnetWriter } from '../../io';

export class BACnetStatusFlags extends BACnetTypeBase {
    public readonly className: string = 'BACnetBitString';
    public readonly type: Enums.PropertyType = Enums.PropertyType.bitString;

    protected tag: Interfaces.Tag;
    protected data: Interfaces.Type.StatusFlags;

    constructor (defValue?: Interfaces.Type.StatusFlags) {
        super();

        this.data = this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetStatusFlags and calls the `readValue`
     * method.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetStatusFlags}
     */
    static readParam (reader: BACnetReader, opts?: Interfaces.ReaderOptions): BACnetStatusFlags {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `status flags` value.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.ReaderOptions) {
        const tag = reader.readTag(opts);
        this.tag = tag;

        const unusedBits = reader.readUInt8(opts);
        // Contains the status bits
        const value = reader.readUInt8(opts);

        const inAlarm = !!TyperUtil.getBit(value, 7);
        const fault = !!TyperUtil.getBit(value, 6);
        const overridden = !!TyperUtil.getBit(value, 5);
        const outOfService = !!TyperUtil.getBit(value, 4);

        this.data = {
            inAlarm: inAlarm,
            fault: fault,
            overridden: overridden,
            outOfService: outOfService,
        };
    }

    /**
     * Writes the BACnet `status flags` as BACnet value.
     *
     * @param  {BACnetWriter} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void {
        writer.writeTag(Enums.PropertyType.bitString, 0, 2);

        // Write unused bits
        writer.writeUInt8(0x04);

        let statusFlags = 0x00;
        statusFlags = TyperUtil.setBit(statusFlags, 7, this.data.inAlarm);
        statusFlags = TyperUtil.setBit(statusFlags, 6, this.data.fault);
        statusFlags = TyperUtil.setBit(statusFlags, 5, this.data.overridden);
        statusFlags = TyperUtil.setBit(statusFlags, 4, this.data.outOfService);

        // Write status flags
        writer.writeUInt8(statusFlags);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {Interfaces.Type.StatusFlags} newValue - new value
     * @return {void}
     */
    public setValue (newValue: Interfaces.Type.StatusFlags): void {
        this.data = this.checkAndGetValue(newValue);
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {Interfaces.Type.StatusFlags}
     */
    public getValue (): Interfaces.Type.StatusFlags {
        return _.cloneDeep(this.data);
    }

    /**
     * `status flags` value
     *
     * @type {Interfaces.Type.StatusFlags}
     */
    public set value (newValue: Interfaces.Type.StatusFlags) {
        this.setValue(newValue);
    }
    /**
     * @type {Interfaces.Type.StatusFlags}
     */
    public get value (): Interfaces.Type.StatusFlags {
        return this.getValue();
    }

    /**
     * HELPERs
     */

    /**
     * Returns `true` if "value" is a correct "status flags" value,
     * throws the error if "value" has incorrect type.
     *
     * @param  {Interfaces.Type.StatusFlags} value - "status flags" value
     * @return {Interfaces.Type.StatusFlags}
     */
    private checkAndGetValue (value: Interfaces.Type.StatusFlags): Interfaces.Type.StatusFlags {
        return _.assign({}, {
            fault: false,
            inAlarm: false,
            outOfService: false,
            overridden: false,
        }, value);
    }
}

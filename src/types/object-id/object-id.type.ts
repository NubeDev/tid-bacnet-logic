import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
    BACnetTagTypes,
} from '../../enums';

import * as Interfaces from '../../interfaces';

import { BACnetError } from '../../errors';

import { BACnetReader, BACnetWriter } from '../../io';

export class BACnetObjectId extends BACnetTypeBase {
    public readonly className: string = 'BACnetObjectId';
    public readonly type: BACnetPropTypes = BACnetPropTypes.objectIdentifier;

    protected tag: Interfaces.BACnet.Tag;
    protected data: Interfaces.BACnet.Type.ObjectId;

    constructor (defValue?: Interfaces.BACnet.Type.ObjectId) {
        super();

        this.data = _.isUndefined(defValue)
            ? { type: 0, instance: 0 }
            : this.checkAndGetValue(_.clone(defValue));
    }

    static readParam (reader: BACnetReader, opts?: Interfaces.BACnet.ReaderOptions): BACnetObjectId {
        return super.readParam(reader, opts);
    }

    /**
     * readValue - parses the message with BACnet "object identifier" value.
     *
     * @param  {BACnetReader} reader - BACnet reader with "object identifier" BACnet value
     * @param  {type} [opts = true] - change offset in the buffer of reader
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.BACnet.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        const encodedObjId = reader.readUInt32BE(opts);
        const decodedObjId = this.decodeObjectIdentifier(encodedObjId);

        this.data = decodedObjId;
    }

    /**
     * writeValue - writes the BACnet "object identifier" value.
     *
     * @param  {BACnetWriter} writer - BACnet writer
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void {
        this.writeParam(writer, {
            num: BACnetPropTypes.objectIdentifier,
            type: BACnetTagTypes.application,
        });
    }

    /**
     * writeParam - writes the BACnet Param as "object identifier" value.
     *
     * @param  {BACnetWriter} writer - BACnet writer
     * @param  {Interfaces.BACnet.Tag} tag - BACnet tag
     * @return {void}
     */
    public writeParam (writer: BACnetWriter, tag: Interfaces.BACnet.Tag): void {
        const dataSize: number = 4;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "object identifier" value
        const objectIdentifier = ((this.data.type & 0x03FF) << 22)
            | (this.data.instance & 0x03FFFFF);
        writer.writeUInt32BE(objectIdentifier);
    }

    /**
     * setValue - sets the new BACnet "object identifier" value as internal state.
     *
     * @param  {Interfaces.BACnet.Type.ObjectId} newValue - new "object identifier" value
     * @return {void}
     */
    public setValue (newValue: Interfaces.BACnet.Type.ObjectId): void {
        this.data = this.checkAndGetValue(_.clone(newValue));
    }

    /**
     * getValue - returns the internal state as current BACnet "object identifier" value.
     *
     * @return {Interfaces.BACnet.Type.ObjectId}
     */
    public getValue (): Interfaces.BACnet.Type.ObjectId {
        return _.cloneDeep(this.data);
    }

    /**
     * value - sets the new BACnet "object identifier" value as internal state
     *
     * @type {Interfaces.BACnet.Type.ObjectId}
     */
    public set value (newValue: Interfaces.BACnet.Type.ObjectId) {
        this.setValue(newValue);
    }

    /**
     * value - returns the internal state as current BACnet "object identifier" value.
     *
     * @type {Interfaces.BACnet.Type.ObjectId}
     */
    public get value (): Interfaces.BACnet.Type.ObjectId {
        return this.getValue();
    }

    /**
     * Performs a comparison between current BACnet value and `data` to determine if
     * they are equivalent.
     *
     * @param  {Interfaces.BACnet.Type.ObjectId|BACnetObjectId} data - data for comparison
     * @return {boolean} - result of the comparison
     */
    public isEqual (data: Interfaces.BACnet.Type.ObjectId|BACnetObjectId): boolean {
        if (_.isNil(data)) {
            return false;
        }

        if (data instanceof BACnetObjectId) {
            return this.isEqualObjectId(this.value, data.value);
        }

        if (typeof data === `object`) {
            return this.isEqualObjectId(this.value, data);
        }

        return false;
    }

    /**
     * checkAndGetValue - checks if "value" is a correct "object identifier" value,
     * throws the error if "value" has incorrect type.
     *
     * @param  {Interfaces.BACnet.Type.ObjectId} value - "object identifier" value
     * @return {Interfaces.BACnet.Type.ObjectId}
     */
    private checkAndGetValue (value: Interfaces.BACnet.Type.ObjectId): Interfaces.BACnet.Type.ObjectId {
        if (!_.has(value, 'type') || !_.has(value, 'instance')) {
            throw new BACnetError('BACnetObjectId - updateValue: Value must be of type "object identifier"!');
        }

        return value;
    }

    /**
     * HELPERs
     */

     /**
      * Compares two BACnet "object identifier" values.
      *
      * @param  {Interfaces.BACnet.Type.ObjectId} objId1 - first "object identifier" value
      * @param  {Interfaces.BACnet.Type.ObjectId} objId2 - second "object identifier" value
      * @return {boolean} - result of the comparison
      */
     private isEqualObjectId (objId1: Interfaces.BACnet.Type.ObjectId,
             objId2: Interfaces.BACnet.Type.ObjectId): boolean {
         return objId1.type === objId2.type
             && objId1.instance === objId2.instance;
     }

    /**
     * decodeObjectIdentifier - decodes the Object Identifier and returns the
     * map with object type and object instance.
     *
     * @param  {number} objId - 4 bytes of object identifier
     * @return {Map<string, any>}
     */
    private decodeObjectIdentifier (objId: number): Interfaces.BACnet.Type.ObjectId {
        let objIdPayload: Interfaces.BACnet.Type.ObjectId;
        const objType = (objId >> 22) & 0x03FF;

        const objInstance = objId & 0x03FFFFF;

        objIdPayload = {
            type: objType,
            instance: objInstance,
        };

        return objIdPayload;
    }
}

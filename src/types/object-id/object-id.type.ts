import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import * as Errors from '../../errors';

import * as IOs from '../../io';

export class BACnetObjectId extends BACnetTypeBase {
    public readonly className: string = 'BACnetObjectId';
    public readonly type: Enums.PropertyType = Enums.PropertyType.objectIdentifier;

    protected tag: Interfaces.Tag;
    protected data: Interfaces.Type.ObjectId;

    constructor (defValue?: Interfaces.Type.ObjectId) {
        super();

        this.data = _.isUndefined(defValue)
            ? { type: 0, instance: 0 }
            : this.checkAndGetValue(_.clone(defValue));
    }

    /**
     * Creates the instance of the BACnetObjectId and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetObjectId}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetObjectId {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `object ID` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        const encodedObjId = reader.readUInt32BE(opts);
        const decodedObjId = this.decodeObjectIdentifier(encodedObjId);

        this.data = decodedObjId;
    }

    /**
     * Writes the BACnet `object ID` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        this.writeParam(writer, {
            num: Enums.PropertyType.objectIdentifier,
            type: Enums.TagType.application,
        });
    }

    /**
     * Writes the BACnet `object ID` as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        const dataSize: number = 4;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "object identifier" value
        const objectIdentifier = ((this.data.type & 0x03FF) << 22)
            | (this.data.instance & 0x03FFFFF);
        writer.writeUInt32BE(objectIdentifier);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {Interfaces.Type.ObjectId} newValue - new value
     * @return {void}
     */
    public setValue (newValue: Interfaces.Type.ObjectId): void {
        this.data = this.checkAndGetValue(_.clone(newValue));
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {Interfaces.Type.ObjectId}
     */
    public getValue (): Interfaces.Type.ObjectId {
        return _.cloneDeep(this.data);
    }

    /**
     * `object ID` value
     *
     * @type {Interfaces.Type.ObjectId}
     */
    public set value (newValue: Interfaces.Type.ObjectId) {
        this.setValue(newValue);
    }
    /**
     * @type {Interfaces.Type.ObjectId}
     */
    public get value (): Interfaces.Type.ObjectId {
        return this.getValue();
    }

    /**
     * Performs a comparison between current BACnet value and `data` to determine if
     * they are equivalent.
     *
     * @param  {Interfaces.Type.ObjectId|BACnetObjectId} data - data for comparison
     * @return {boolean} - result of the comparison
     */
    public isEqual (data: Interfaces.Type.ObjectId|BACnetObjectId): boolean {
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
     * Returns `true` if "value" is a correct "object identifier" value,
     * throws the error if "value" has incorrect type.
     *
     * @param  {Interfaces.Type.ObjectId} value - "object identifier" value
     * @return {Interfaces.Type.ObjectId}
     */
    private checkAndGetValue (value: Interfaces.Type.ObjectId): Interfaces.Type.ObjectId {
        if (!_.has(value, 'type') || !_.has(value, 'instance')) {
            throw new Errors.BACnet('BACnetObjectId - updateValue: Value must be of type "object identifier"!');
        }

        return value;
    }

    /**
     * HELPERs
     */

     /**
      * Compares two BACnet "object identifier" values.
      *
      * @param  {Interfaces.Type.ObjectId} objId1 - first "object identifier" value
      * @param  {Interfaces.Type.ObjectId} objId2 - second "object identifier" value
      * @return {boolean} - result of the comparison
      */
     private isEqualObjectId (objId1: Interfaces.Type.ObjectId,
             objId2: Interfaces.Type.ObjectId): boolean {
         return objId1.type === objId2.type
             && objId1.instance === objId2.instance;
     }

    /**
     * Decodes the Object Identifier and returns the
     * map with object type and object instance.
     *
     * @param  {number} objId - 4 bytes of object identifier
     * @return {Map<string, any>}
     */
    private decodeObjectIdentifier (objId: number): Interfaces.Type.ObjectId {
        let objIdPayload: Interfaces.Type.ObjectId;
        const objType = (objId >> 22) & 0x03FF;

        const objInstance = objId & 0x03FFFFF;

        objIdPayload = {
            type: objType,
            instance: objInstance,
        };

        return objIdPayload;
    }
}

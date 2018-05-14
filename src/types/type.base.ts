import { APIError } from '../errors';

import { BACnetReader, BACnetWriter } from '../io';

import * as Interfaces from '../interfaces';

export class BACnetTypeBase {
    public readonly className: string = 'BACnetTypeBase';
    protected tag: Interfaces.Tag;
    protected data: any;

    static readParam (reader: BACnetReader, opts?: Interfaces.ReaderOptions): any {
        const inst = new this();

        const readOpts = reader.extractOpts(opts);
        if (readOpts.optional && readOpts.tag
            && !reader.isTag(readOpts.tag)) {
            return inst;
        }

        inst.readValue(reader, opts);
        return inst;
    }

    /**
     * readValue - parses the message with BACnet value.
     *
     * @param  {BACnetReader} reader - BACnet reader with "unsigned integer" BACnet value
     * @param  {type} [opts = true] - change offset in the buffer of reader
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.ReaderOptions): void { ; }

    /**
     * writeValue - writes the BACnet value.
     *
     * @param  {BACnetWriter} writer - BACnet writer
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void { ; }

    public writeParam (writer: BACnetWriter, tag: Interfaces.Tag): void {
        throw new APIError(`${this.className} - writeParam: Not implemented yet`);
    }

    /**
     * setValue - sets the new internal state.
     *
     * @param  {any} newValue - new "unsigned integer" value
     * @return {void}
     */
    public setValue (newValute: any): void { ; }

    /**
     * getValue - returns the internal state.
     *
     * @return {any}
     */
    public getValue (): any { ; }

    /**
     * value - sets the new internal state
     *
     * @type {any}
     */
    public get value (): any { return null; }

    /**
     * value - returns the internal state..
     *
     * @type {any}
     */
    public set value (newValute: any) { ; }

    /**
     * getTag - returns the BACnet tag.
     *
     * @return {Interfaces.Tag}
     */
    public getTag (): Interfaces.Tag {
        return this.tag;
    }
}

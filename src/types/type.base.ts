import { APIError } from '../errors';

import { BACnetReader, BACnetWriter } from '../io';

import * as Interfaces from '../interfaces';

export class BACnetTypeBase {
    public readonly className: string = 'BACnetTypeBase';
    protected tag: Interfaces.Tag;
    protected data: any;

    /**
     * Creates the instance of the BACnet Type and calls the `readValue`
     * method.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {any}
     */
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
     * Parses the message with BACnet value.
     *
     * @param  {BACnetReader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: BACnetReader, opts?: Interfaces.ReaderOptions): void { ; }

    /**
     * Writes the BACnet Type as BACnet value.
     *
     * @param  {BACnetWriter} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: BACnetWriter): void { ; }

    /**
     * Writes the BACnet Type as BACnet property (param).
     *
     * @param  {BACnetWriter} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: BACnetWriter, tag: Interfaces.Tag): void {
        throw new APIError(`${this.className} - writeParam: Not implemented yet`);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {any} newValue - new value
     * @return {void}
     */
    public setValue (newValute: any): void { ; }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {any}
     */
    public getValue (): any { ; }

    /**
     * `Type` value
     *
     * @type {any}
     */
    public get value (): any { return null; }
    /**
     * @type {any}
     */
    public set value (newValute: any) { ; }

    /**
     * Returns the BACnet tag of the BACnet property.
     *
     * @return {Interfaces.Tag}
     */
    public getTag (): Interfaces.Tag {
        return this.tag;
    }
}

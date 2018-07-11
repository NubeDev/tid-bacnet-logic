import * as Errors from '../errors';

import * as IOs from '../io';

import * as Interfaces from '../interfaces';

export class BACnetTypeBase {
    public readonly className: string = 'BACnetTypeBase';
    protected tag: Interfaces.Tag;
    protected data: any;

    /**
     * Creates the instance of the BACnet Type and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {any}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): any {
        const inst = new this();

        const readOpts = reader.extractOpts(opts);
        if (readOpts.optional && readOpts.tag
            && !reader.isTag(readOpts.tag)) {
            return null;
        }

        inst.readValue(reader, opts);
        return inst;
    }

    /**
     * Parses the message with BACnet value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void { ; }

    /**
     * Writes the BACnet Type as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void { ; }

    /**
     * Writes the BACnet Type as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        throw new Errors.API(`${this.className} - writeParam: Not implemented yet`);
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

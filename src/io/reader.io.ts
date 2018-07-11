import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import { Offset } from './offset.io';

import * as Utils from '../utils';

import * as BACnetTypes from '../types';

type ReaderOperation <T> = () => T;

export class Reader {
    public offset: Offset;

    constructor (private buffer: Buffer) {
        this.offset = new Offset(0);
    }

    /**
     * getRange - returns the part of buffer from "start" to the "end" position.
     *
     * @param  {number} start - start position
     * @param  {number} end - end position
     * @return {Buffer}
     */
    public getRange (start: number, end?: number): Buffer {
        return this.buffer.slice(start, end);
    }

    /**
     * readUInt8 - reads the 1 byte from the internal buffer.
     *
     * @return {number}
     */
    public readUInt8 (opts?: Interfaces.ReaderOptions): number {
        return this.handleReadOperation(() => {
            return this.buffer.readUInt8(this.offset.inc());
        }, opts, `readUInt8`);
    }

    /**
     * readUInt16BE - reads the 2 bytes from the internal buffer.
     *
     * @return {number}
     */
    public readUInt16BE (opts?: Interfaces.ReaderOptions): number {
        return this.handleReadOperation(() => {
            return this.buffer.readUInt16BE(this.offset.inc(2));
        }, opts, `readUInt16BE`);
    }

    /**
     * readUInt32BE - reads the 4 bytes (int) from the internal buffer.
     *
     * @return {number}
     */
    public readUInt32BE (opts?: Interfaces.ReaderOptions): number {
        return this.handleReadOperation(() => {
            return this.buffer.readUInt32BE(this.offset.inc(4));
        }, opts, `readUInt32BE`);
    }

    /**
     * readUIntBE - reads the @param {number} len bytes (int) from the internal buffer.
     *
     * @return {number}
     */
    public readUIntBE (len: number, opts?: Interfaces.ReaderOptions): number {
        return this.handleReadOperation(() => {
            return this.buffer.readUIntBE(this.offset.inc(len), len);
        }, opts, `readUIntBE`);
    }

    /**
     * readFloatBE - reads the 4 bytes (float) from the internal buffer.
     *
     * @return {number}
     */
    public readFloatBE (opts?: Interfaces.ReaderOptions): number {
        return this.handleReadOperation(() => {
            return this.buffer.readFloatBE(this.offset.inc(4));
        }, opts, `readFloatBE`);
    }

    /**
     * readString - reads the N bytes from the internal buffer and converts
     * the result to the string.
     *
     * @param  {string} encoding - character encoding
     * @param  {number} len - lenght of string
     * @return {string}
     */
    public readString (encoding: string, len: number, opts?: Interfaces.ReaderOptions): string {
        return this.handleReadOperation(() => {
            const offStart = this.offset.inc(len);
            const offEnd = this.offset.getVaule();

            return this.buffer.toString(encoding, offStart, offEnd);
        }, opts, `readString`);
    }

    /**
     * readTag - reads the BACnet tag from the internal buffer and returns map with:
     * - number = tag number (number)
     * - class = tag class (number)
     * - value = tag value (number)
     *
     * @return {Map<string, number>}
     */
    public readTag (opts?: Interfaces.ReaderOptions): Interfaces.Tag {
        let tagData: Interfaces.Tag;

        const tag = this.readUInt8(opts);

        if (_.isNil(tag)) {
            return null;
        }

        const tagNumber = Utils.Typer.getBitRange(tag, 4, 4);

        const tagType =  Utils.Typer.getBit(tag, 3);

        const tagValue = Utils.Typer.getBitRange(tag, 0, 3);

        tagData = {
            num: tagNumber,
            type: tagType,
            value: tagValue,
        }

        return tagData;
    }

    /**
     * Handles the reader operations using the `user` or `default` reader options.
     *
     * @param  {} operationFn
     * @return {T}
     */
    private handleReadOperation <T> (operationFn: ReaderOperation<T>,
            opts: Interfaces.ReaderOptions, methodName: string): T {
        const readerOpts = this.extractOpts(opts);

        if (readerOpts.silent) {
            this.offset.disable();
        }

        let result: T = null;
        let error: Errors.Reader = null;
        let oldOffset: number = this.offset.value;

        try {
            result = operationFn();
        } catch (error) {
            if (!readerOpts.optional) {
                error = new Errors.Reader(`IOs.Reader - ${methodName}: ${error}`,
                    Enums.ReaderError.IsNotOptional);
            }

            if (!readerOpts.silent) {
                this.offset.value = oldOffset;
            }
        }

        if (readerOpts.silent) {
            this.offset.enable();
        }

        if (_.isNil(error)) {
            return result;
        }

        throw error;
    }

    public extractOpts (opts?: Interfaces.ReaderOptions): Interfaces.ReaderOptions {
        const defOpts: Interfaces.ReaderOptions = {
            optional: false,
            silent: false,
        };

        return _.assign(defOpts, opts);
    }

    /**
     * isOpeningTag - return true if tag is an opening tag
     *
     * @param  {Interfaces.Tag} tag - tag
     * @return {boolean}
     */
    public isOpeningTag (tag: Interfaces.Tag): boolean {
        return tag.type === Enums.TagType.context
            && tag.value === 0x06;
    }

    /**
     * isClosingTag - return true if tag is a closing tag
     *
     * @param  {Interfaces.Tag} tag - tag
     * @return {boolean}
     */
    public isClosingTag (tag: Interfaces.Tag): boolean {
        return tag.type === Enums.TagType.context
            && tag.value === 0x07;
    }

    /**
     * Checks the tag number and tag type.
     *
     * @param  {Interfaces.Tag} tag - tag
     * @return {boolean}
     */
    public isTag (tag: Interfaces.Tag): boolean {
        if (_.isNil(tag)) {
            return false;
        }

        const respTag = this.readTag({ silent: true, optional: true });

        return !_.isNil(respTag)
            && respTag.num === tag.num
            && respTag.type === tag.type;
    }
}

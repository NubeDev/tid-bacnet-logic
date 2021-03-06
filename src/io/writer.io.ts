import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import { Offset } from './offset.io';

import * as Utils from '../utils';

import * as BACnetTypes from '../types';

export class Writer {
    public offset: Offset;
    private buffer: Buffer;

    constructor (resultBuf?: Buffer) {
        this.offset = new Offset(0);

        if (!resultBuf) {
            this.buffer = Buffer.alloc(0);
            return;
        }
        this.buffer = resultBuf;
        const offsetValue = resultBuf.length;
        this.offset = new Offset(offsetValue);
    }

    /**
     * size - returns the size of internal buffer.
     *
     * @return {number}
     */
    get size (): number {
        return this.buffer.length;
    }

    /**
     * concat - concatenates the writers and returns the writer with common buffer.
     *
     * @static
     * @param  {IOs.Writer[]} restsOfWriters - description
     * @return {type}
     */
    static concat (...restsOfWriters: Writer[]) {
        const resultBuf = _.reduce(restsOfWriters, (result, writer) => {
            const bufOfWriter = writer.getBuffer();
            return Buffer.concat([result, bufOfWriter]);
        }, Buffer.alloc(0));
        return new Writer(resultBuf);
    }

    public getBuffer () {
        return this.buffer;
    }

    /**
     * increasBufferSize - increases the size of the internal buffer.
     *
     * @param  {number} len - new size
     * @return {void}
     */
    private increasBufferSize (size: number): void {
        const newBuffer = Buffer.alloc(size);
        this.buffer = Buffer.concat([this.buffer, newBuffer]);
    }

    /**
     * writeUInt8 - writes 1 byte to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt8 (value: number): void {
        this.increasBufferSize(1);
        this.buffer.writeUInt8(value, this.offset.inc());
    }

    /**
     * writeUInt16BE - writes 2 bytes to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt16BE (value: number): void {
        this.increasBufferSize(2);
        this.buffer.writeUInt16BE(value, this.offset.inc(2));
    }

    /**
     * writeUInt32BE - writes 4 bytes (integer) to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt32BE (value: number): void {
        this.increasBufferSize(4);
        this.buffer.writeUInt32BE(value, this.offset.inc(4));
    }

    /**
     * writeFloatBE - writes 4 bytes (real) to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeFloatBE (value: number): void {
        this.increasBufferSize(4);
        this.buffer.writeFloatBE(value, this.offset.inc(4));
    }

    /**
     * writeString - reads the N bytes from the internal buffer and converts
     * the result to the string.
     *
     * @param  {string} encoding - character encoding
     * @param  {number} len - lenght of string
     * @return {string}
     */
    public writeString (str: string, encoding: string = 'utf8'): void {
        const strLen = str.length;
        const offStart = this.offset.inc(strLen);
        this.increasBufferSize(strLen);
        this.buffer.write(str, offStart, strLen, encoding);
    }

    /**
     * writeTag - writes BACnet tag to the internal buffer.
     *
     * @param  {number} tagNumber - tag number/context
     * @param  {Enums.TagType} tagType - tag class
     * @param  {number} tagValue - tag value
     * @return {void}
     */
    public writeTag (
            tagNumber: number, tagType: Enums.TagType, tagValue: number): void {
        // Tag = Tag Number 4 bits, Tag Class 1 bits, Tag Value 3 bits
        let tag = 0x00;
        tag = Utils.Typer.setBitRange(tag, 4, 4, tagNumber);
        tag = Utils.Typer.setBit(tag, 3, tagType);
        tag = Utils.Typer.setBitRange(tag, 0, 3, tagValue);

        this.writeUInt8(tag);
    }

    /**
     * writeUIntValue - writes unsigned integer value to the internal buffer.
     *
     * @param  {number} uIntValue - unsigned int value
     * @return {void}
     */
    public writeUIntValue (uIntValue: number): void {
        // DataType - Application tag - DataTypeSize
        if (uIntValue <= Enums.OpertionMaxValue.uInt8) {
            this.writeUInt8(uIntValue);
        } else if (uIntValue <= Enums.OpertionMaxValue.uInt16) {
            this.writeUInt16BE(uIntValue);
        } else if (uIntValue <= Enums.OpertionMaxValue.uInt32) {
            this.writeUInt32BE(uIntValue);
        }
    }
}

// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import * as Errors from '../errors';

import * as IOs from './writer.io';

/* Interfaces */

describe('IOs.Writer', () => {
    describe('writeUInt8', () => {
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should set the 0x2c value in position 0', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            testBuffer(bacnetWriterUtil, [ 0x2c ]);
        });

        it('should set the 0x2c/0x0a value in position 0/1', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeUInt8(0x0a);
            testBuffer(bacnetWriterUtil, [ 0x2c, 0x0a ]);
        });
    });

    describe('writeUInt16BE', () => {
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should set the 0x4f2c value in position 0-1', () => {
            bacnetWriterUtil.writeUInt16BE(0x4f2c);
            testBuffer(bacnetWriterUtil, [ 0x4f, 0x2c ]);
        });

        it('should set the 0x4f2c/0x120a value in position 0-1/1-2', () => {
            bacnetWriterUtil.writeUInt16BE(0x4f2c);
            bacnetWriterUtil.writeUInt16BE(0x120a);
            testBuffer(bacnetWriterUtil, [ 0x4f, 0x2c, 0x12, 0x0a ]);
        });
    });

    describe('writeUInt32BE', () => {
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should set the 0x120a4f2c value in position 0-3', () => {
            bacnetWriterUtil.writeUInt32BE(0x120a4f2c);
            testBuffer(bacnetWriterUtil, [ 0x12, 0x0a, 0x4f, 0x2c ]);
        });

        it('should set the 0x120a4f2c/0x12345678 value in position 0-3/4-7', () => {
            bacnetWriterUtil.writeUInt32BE(0x120a4f2c);
            bacnetWriterUtil.writeUInt32BE(0x12345678);
            testBuffer(bacnetWriterUtil, [ 0x12, 0x0a, 0x4f, 0x2c, 0x12, 0x34, 0x56, 0x78 ]);
        });
    });

    describe('writeString', () => {
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should set the "L02" value in position 0-2', () => {
            bacnetWriterUtil.writeString('L02');
            testBuffer(bacnetWriterUtil, [ 0x4c, 0x30, 0x32 ]);
        });

        it('should set the 0x2c/"LI2" value in position 0/1-3', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeString('LI2');
            testBuffer(bacnetWriterUtil, [ 0x2c, 0x4c, 0x49, 0x32 ]);
        });

        it('should set the 0x1f/"LI2"/0x0a value in position 0/1-3/4', () => {
            bacnetWriterUtil.writeUInt8(0x1f);
            bacnetWriterUtil.writeString('LI2');
            bacnetWriterUtil.writeUInt8(0x0a);
            testBuffer(bacnetWriterUtil, [ 0x1f, 0x4c, 0x49, 0x32, 0x0a ]);
        });
    });

    describe('writeTag', () => {
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should set tag 2/0/2', () => {
            bacnetWriterUtil.writeTag(2, 0, 2);
            testBuffer(bacnetWriterUtil, [ 0x22 ]);
        });

        it('should set tag 12/0/4', () => {
            bacnetWriterUtil.writeTag(12, 0, 4);
            testBuffer(bacnetWriterUtil, [ 0xc4 ]);
        });

        it('should set tag 1/1/1', () => {
            bacnetWriterUtil.writeTag(1, 1, 1);
            testBuffer(bacnetWriterUtil, [ 0x19 ]);
        });

        it('should set tag 2/1/4', () => {
            bacnetWriterUtil.writeTag(2, 1, 4);
            testBuffer(bacnetWriterUtil, [ 0x2c ]);
        });

        it('should set tag 12/0/4 and byte 0x2c', () => {
            bacnetWriterUtil.writeTag(12, 0, 4);
            bacnetWriterUtil.writeUInt8(0x2c);
            testBuffer(bacnetWriterUtil, [ 0xc4, 0x2c ]);
        });

        it('should set tag 1/1/1 and byte 0x1f', () => {
            bacnetWriterUtil.writeTag(1, 1, 1);
            bacnetWriterUtil.writeUInt8(0x1f);
            testBuffer(bacnetWriterUtil, [ 0x19, 0x1f ]);
        });
    });
});

function testBuffer (bacnetWriterUtil: IOs.Writer, buffer: number[]) {
    const writerBuffer = bacnetWriterUtil.getBuffer();
    const proposedBuffer = Buffer.from(buffer);
    expect(writerBuffer).to.deep.equal(proposedBuffer);
}

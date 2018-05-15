import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { BACnetBoolean } from './boolean.type';

import * as IOs from '../../io';

describe('BACnetBoolean', () => {
    describe('readValue', () => {
        let bacnetBoolean: BACnetBoolean;
        let bacnetReaderUtil: IOs.Reader;

        beforeEach(() => {
            bacnetBoolean = new BACnetBoolean();
        });

        it('should read correct tag', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x11]));
            bacnetBoolean.readValue(bacnetReaderUtil);

            const tag = bacnetBoolean.getTag();
            expect(tag).to.deep.equal({ num: 1, type: 0, value: 1 });
        });

        it('should read "true" value', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x11]));
            bacnetBoolean.readValue(bacnetReaderUtil);

            const value = bacnetBoolean.getValue();
            expect(value).to.equal(true);
        });

        it('should read "false" value', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x10]));
            bacnetBoolean.readValue(bacnetReaderUtil);

            const value = bacnetBoolean.getValue();
            expect(value).to.equal(false);
        });
    });

    describe('writeValue', () => {
        let bacnetBoolean: BACnetBoolean;
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should write correct buffer for "true" value', () => {
            bacnetBoolean = new BACnetBoolean(true);
            bacnetBoolean.writeValue(bacnetWriterUtil);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([0x11]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });

        it('should write correct buffer for "false" value', () => {
            bacnetBoolean = new BACnetBoolean(false);
            bacnetBoolean.writeValue(bacnetWriterUtil);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([0x10]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
    });
});

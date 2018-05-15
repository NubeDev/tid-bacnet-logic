import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { BACnetEnumerated } from './enumerated.type';

import * as IOs from '../../io';

describe('BACnetEnumerated', () => {
    describe('readValue', () => {
        let bacnetEnumerated: BACnetEnumerated;
        let bacnetReaderUtil: IOs.Reader;

        beforeEach(() => {
            bacnetEnumerated = new BACnetEnumerated();
        });

        it('should read correct tag', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x91, 0x12]));
            bacnetEnumerated.readValue(bacnetReaderUtil);

            const tag = bacnetEnumerated.getTag();
            expect(tag).to.deep.equal({ num: 9, type: 0, value: 1 });
        });

        it('should read "0x12" value', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x91, 0x12]));
            bacnetEnumerated.readValue(bacnetReaderUtil);

            const value = bacnetEnumerated.getValue();
            expect(value).to.equal(0x12);
        });

        it('should read "0x44" value', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x91, 0x44]));
            bacnetEnumerated.readValue(bacnetReaderUtil);

            const value = bacnetEnumerated.getValue();
            expect(value).to.equal(0x44);
        });
    });

    describe('writeValue', () => {
        let bacnetEnumerated: BACnetEnumerated;
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should write correct buffer for "true" value', () => {
            bacnetEnumerated = new BACnetEnumerated(0x12);
            bacnetEnumerated.writeValue(bacnetWriterUtil);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([0x91, 0x12]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });

        it('should write correct buffer for "false" value', () => {
            bacnetEnumerated = new BACnetEnumerated(0x44);
            bacnetEnumerated.writeValue(bacnetWriterUtil);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([0x91, 0x44]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
    });
});

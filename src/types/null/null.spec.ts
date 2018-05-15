import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { BACnetNull } from './null.type';

import * as IOs from '../../io';

describe('BACnetNull', () => {
    describe('readValue', () => {
        let bacnetNull: BACnetNull;
        let bacnetReaderUtil: IOs.Reader;

        beforeEach(() => {
            bacnetNull = new BACnetNull();
        });

        it('should read correct tag', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x11]));
            bacnetNull.readValue(bacnetReaderUtil);

            const tag = bacnetNull.getTag();
            expect(tag).to.deep.equal({ num: 1, type: 0, value: 1 });
        });

        it('should read "null" value', () => {
            bacnetReaderUtil = new IOs.Reader(Buffer.from([0x11]));
            bacnetNull.readValue(bacnetReaderUtil);

            const value = bacnetNull.getValue();
            expect(value).to.equal(null);
        });
    });

    describe('writeValue', () => {
        let bacnetNull: BACnetNull;
        let bacnetWriterUtil: IOs.Writer;

        beforeEach(() => {
            bacnetWriterUtil = new IOs.Writer();
        });

        it('should write correct buffer for "null" value', () => {
            bacnetNull = new BACnetNull();
            bacnetNull.writeValue(bacnetWriterUtil);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([0x00]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
    });
});

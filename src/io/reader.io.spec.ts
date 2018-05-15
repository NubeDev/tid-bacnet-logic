// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import * as Errors from '../errors';

import * as IOs from './reader.io';

/* Interfaces */

describe('IOs.Reader', () => {
    describe('getRange', () => {
        let readerUtil: IOs.Reader;

        beforeEach(() => {
            const buf = Buffer.from([0x81, 0x0a, 0x00, 0x11, 0x01, 0x04, 0x00, 0x05]);
            readerUtil = new IOs.Reader(buf);
        });

        it('should slice the buffer from 0 to 5 position', () => {
            const newBuf = readerUtil.getRange(0, 5);
            expect(newBuf).to.deep.equal(Buffer.from([0x81, 0x0a, 0x00, 0x11, 0x01]));
        });
        it('should slice the buffer from 2 to 5 position', () => {
            const newBuf = readerUtil.getRange(2, 5);
            expect(newBuf).to.deep.equal(Buffer.from([0x00, 0x11, 0x01]));
        });
        it('should slice the buffer from 5 to 7 position', () => {
            const newBuf = readerUtil.getRange(5, 7);
            expect(newBuf).to.deep.equal(Buffer.from([0x04, 0x00]));
        });
    });
});

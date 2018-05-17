// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import * as Errors from '../errors';

import { Typer } from './typer.util';

/* Interfaces */

describe('Utils.Typer', () => {
    describe('writeUInt8', () => {
        it('should return 0x0a if bitMap = 0x26, value = 0x5, start = 1, len = 5', () => {
            const result = Typer.setBitRange(0x26, 1, 5, 0x5);
            expect(result).to.equal(0x0a);
        });
        it('should return 0x3e if bitMap = 0x26, value = 0x3, start = 3, len = 2', () => {
            const result = Typer.setBitRange(0x26, 3, 2, 0x3);
            expect(result).to.equal(0x3e);
        });
        it('should return 0x3e if bitMap = 0x26, value = 0x3, start = 3, len = 1', () => {
            const result = Typer.setBitRange(0x26, 3, 1, 0x3);
            expect(result).to.equal(0x2e);
        });
        it('should return 0x3e if bitMap = 0x26, value = 0x3, start = 2, len = 2', () => {
            const result = Typer.setBitRange(0x26, 2, 2, 0x3);
            expect(result).to.equal(0x2e);
        });
    });
});

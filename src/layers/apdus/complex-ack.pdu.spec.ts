// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { complexACKPDU } from './complex-ack.pdu';

import * as Interfaces from '../../interfaces';

describe('ComplexACKPDU', () => {
    describe('getFromBuffer', () => {
        let buf: Buffer;

        it('should return Map with correct metadata', () => {
            buf = Buffer.from([0x30, 0x01, 0x0c, 0x0c, 0x02, 0x00,
                0x00, 0x01, 0x19, 0x0c, 0x3e, 0x75, 0x07, 0x00, 0x56, 0x31, 0x2e, 0x30, 0x2e, 0x30, 0x3f]);
            const newBuf = complexACKPDU.getFromBuffer(buf);
        });
    });
});

// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { unconfirmedReqPDU } from './unconfirmed-req.pdu';

import * as Interfaces from '../../interfaces';

describe('ComplexACKPDU', () => {
    describe('getFromBuffer', () => {
        let buf: Buffer;

        it('should return Map with correct metadata', () => {
            buf = Buffer.from([ 0x10, 0x02, 0x09, 0x00, 0x1c, 0x02, 0x00, 0x00, 0x01,
                0x2c, 0x00, 0xc0, 0x00, 0x00, 0x39, 0x00,
                0x4e, 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f, 0x09, 0x6f, 0x2e, 0x82, 0x04, 0x00, 0x2f, 0x4f ]);
            const newBuf = unconfirmedReqPDU.getFromBuffer(buf);
        });
    });
});

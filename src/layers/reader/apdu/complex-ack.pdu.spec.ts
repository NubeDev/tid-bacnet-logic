import { expect } from 'chai';

import { ComplexACK } from './complex-ack.pdu';

import * as Interfaces from '../../../interfaces';

import * as IOs from '../../../io';

describe('ComplexACKPDU', () => {
    describe('getFromBuffer', () => {
        let buf: Buffer;

        it('should return Map with correct metadata', () => {
            buf = Buffer.from([0x30, 0x01, 0x0c, 0x0c, 0x02, 0x00,
                0x00, 0x01, 0x19, 0x0c, 0x3e, 0x75, 0x07, 0x00, 0x56, 0x31, 0x2e, 0x30, 0x2e, 0x30, 0x3f]);
            const reader = new IOs.Reader(buf);
            const newBuf = ComplexACK.readLayer(reader);
        });

        it('should return Map with correct metadata', () => {
            buf = Buffer.from([0x30, 0x01, 0x0c, 0x0c, 0x04, 0xc0, 0x00, 0x00, 0x19, 0x6e, 0x3e, 0x00, 0x3f]);
            const reader = new IOs.Reader(buf);
            const newBuf = ComplexACK.readLayer(reader);
        });
    });
});

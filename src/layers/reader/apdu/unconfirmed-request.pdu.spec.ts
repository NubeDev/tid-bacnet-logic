import { expect } from 'chai';

import { UnconfirmedRequest } from './unconfirmed-request.pdu';

import * as IOs from '../../../io';

describe('ComplexACKPDU', () => {
    describe('getFromBuffer', () => {
        let buf: Buffer;

        it('should return Map with correct metadata', () => {
            console.log(`------`);
            buf = Buffer.from([ 0x10, 0x02, 0x09, 0x00,
                0x1c, 0x02, 0x00, 0x00, 0x01,
                0x2c, 0x00, 0xc0, 0x00, 0x00,
                0x39, 0x00,
                0x4e, 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f, 0x09, 0x6f, 0x2e, 0x82, 0x04, 0x00, 0x2f, 0x4f ]);
            const reader = new IOs.Reader(buf);
            const newBuf = UnconfirmedRequest.readLayer(reader);
        });
    });
});

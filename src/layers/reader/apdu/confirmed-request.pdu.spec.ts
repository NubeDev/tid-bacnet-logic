import { expect } from 'chai';

import { ConfirmedRequest } from './confirmed-request.pdu';

import * as Interfaces from '../../../interfaces';

import * as IOs from '../../../io';
import { IO } from '../../..';

describe('ConfirmedReqPDU', () => {
    describe('readSubscribeCOV', () => {
        let buf: Buffer;

        it('should read COV request with issueConf & lifetime params', () => {
            buf = Buffer.from('0005010509001c0140001a29003c000493e0', 'hex');
            const reader = new IOs.Reader(buf);
            const msg = ConfirmedRequest.readLayer(reader);
            const subReq = msg.service as Interfaces.ConfirmedRequest.Service.SubscribeCOV;
            //console.log(JSON.stringify(msg));
            expect(subReq.issConfNotif.value).to.equal(false);
            expect(subReq.lifetime.value).to.equal(300000);
        });

        it('should read COV request without issueConf & lifetime params', () => {
            buf = Buffer.from('0005010509001c0140001a', 'hex');
            const reader = new IOs.Reader(buf);
            const msg = ConfirmedRequest.readLayer(reader);
            const subReq = msg.service as Interfaces.ConfirmedRequest.Service.SubscribeCOV;
            // console.log(JSON.stringify(msg));
            expect(subReq.issConfNotif).to.equal(null);
            expect(subReq.lifetime).to.equal(null);
        });

    });
});

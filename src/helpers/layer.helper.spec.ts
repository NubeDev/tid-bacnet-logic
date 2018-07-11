import {
    expect
} from 'chai';

import {
    Layer
} from './layer.helper';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as Types from '../types';

import * as IOs from '../io';

describe('Helpers.Layer', () => {
    describe('bufferToLayer', () => {
        let buf: Buffer;

        it('should read layer', () => {
            buf = Buffer.from('810a00270100100209001c0200270f2c0140001a3b0493e04e09552e91002f096f2e8204002f4f', 'hex');
            const notif = Layer.bufferToLayer(buf).apdu.service as Interfaces.UnconfirmedRequest.Service.COVNotification;
            console.log(JSON.stringify(notif));
            expect(notif.objId.value.type).to.equal(5);
            expect(notif.objId.value.instance).to.equal(26);
        });

    });
});

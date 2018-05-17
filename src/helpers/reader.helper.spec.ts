import { expect } from 'chai';

import { Reader } from './reader.helper';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as Types from '../types';

import * as IOs from '../io';

describe('Helpers.Reader', () => {
    describe('readProperty', () => {
        let buf: Buffer;

        it('should read property ID with 0 context number', () => {
            buf = Buffer.from([ 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.id.value).to.equal(Enums.PropertyId.presentValue);
        });
        it('should read property ID with 1 context number', () => {
            buf = Buffer.from([ 0x19, 0x6f, 0x3e, 0x82, 0x04, 0x00, 0x3f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.id.value).to.equal(Enums.PropertyId.statusFlags);
        });


        it('should read property index with 1 context number', () => {
            buf = Buffer.from([ 0x09, 0x55, 0x19, 0x02, 0x2e, 0x91, 0x01, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.index.value).to.equal(2);
        });
        it('should read property index with 2 context number', () => {
            buf = Buffer.from([ 0x19, 0x6f, 0x29, 0x00, 0x3e, 0x82, 0x04, 0x00, 0x3f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.index.value).to.equal(0);
        });


        it('should read property value with 2 context number', () => {
            buf = Buffer.from([ 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.values[0].value).to.equal(1);
        });
        it('should read property value with 3 context number', () => {
            buf = Buffer.from([ 0x09, 0x6f, 0x2e, 0x82, 0x04, 0x00, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.values[0].value).to.deep.equal({
                fault: false,
                inAlarm: false,
                outOfService: false,
                overridden: false,
            });
        });


        it('should read property priority with 3 context number', () => {
            buf = Buffer.from([ 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f, 0x39, 0x08 ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.priority.value).to.equal(8);
        });
        it('should read property priority with 4 context number', () => {
            buf = Buffer.from([ 0x19, 0x55, 0x3e, 0x91, 0x01, 0x3f, 0x49, 0x06 ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperty(reader);

            expect(data.priority.value).to.equal(6);
        });
    });

    describe('readProperties', () => {
        let buf: Buffer;

        it('should read 1 property', () => {
            buf = Buffer.from([ 0x4e, 0x09, 0x6f, 0x2e, 0x82, 0x04, 0x00, 0x2f, 0x4f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperties(reader);

            expect(data.length).to.equal(1);

            expect(data[0].id.value).to.equal(Enums.PropertyId.statusFlags);
        });
        it('should read 2 properties', () => {
            buf = Buffer.from([ 0x4e, 0x09, 0x55, 0x2e, 0x91, 0x01, 0x2f,
                0x09, 0x6f, 0x2e, 0x82, 0x04, 0x00, 0x2f, 0x4f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readProperties(reader);

            expect(data.length).to.equal(2);

            expect(data[0].id.value).to.equal(Enums.PropertyId.presentValue);
            expect(data[1].id.value).to.equal(Enums.PropertyId.statusFlags);
        });
    });

    describe('readPropertyValues', () => {
        let buf: Buffer;

        it('should read "Null" value', () => {
            buf = Buffer.from([ 0x2e, 0x00, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetNull().className);
        });

        it('should read "Boolean" value', () => {
            buf = Buffer.from([ 0x2e, 0x11, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetBoolean().className);
        });

        it('should read "UnsignedInteger" value', () => {
            buf = Buffer.from([ 0x2e, 0x21, 0x01, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetUnsignedInteger().className);
        });

        it('should read "Real" value', () => {
            buf = Buffer.from([ 0x2e, 0x44, 0x42, 0x90, 0x00, 0x00, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetReal().className);
        });

        it('should read "Character String" value', () => {
            buf = Buffer.from([ 0x2e, 0x75, 0x19, 0x00, 0x54, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73,
                0x20, 0x61, 0x20, 0x42, 0x41, 0x43, 0x6E, 0x65, 0x74,
                0x20, 0x73, 0x74, 0x72, 0x69, 0x6E, 0x67, 0x21, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetCharacterString().className);
        });

        it('should read "Enumerated" value', () => {
            buf = Buffer.from([ 0x2e, 0x91, 0x01, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetEnumerated().className);
        });

        it('should read "Object ID" value', () => {
            buf = Buffer.from([ 0x2e, 0xc4, 0x00, 0xC0, 0x00, 0x0F, 0x2f ]);
            const reader = new IOs.Reader(buf);
            const data = Reader.readPropertyValues(reader);

            expect(data.length).to.equal(1);

            expect(data[0].className).to.equal(new Types.BACnetObjectId().className);
        });
    });
});

import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import { BACnetReader } from '../io';

export class BACnetReaderUtil {
    /**
     * Reads BACnet property from buffer of the reader.
     *
     * @return {Map<string, any>}
     */
    static readProperty (reader: BACnetReader, opts?: Interfaces.ReaderOptions): Interfaces.PropertyValue {
        const propId = BACnetTypes.BACnetEnumerated.readParam(reader);
        const propIndex = BACnetTypes.BACnetUnsignedInteger.readParam(reader, {
            optional: true,
            tag: { num: 2, type: Enums.TagType.context },
        });
        const propValues = BACnetReaderUtil.readPropertyValues(reader, opts);
        const propPriority = BACnetTypes.BACnetUnsignedInteger.readParam(reader, {
            optional: true,
            tag: { num: 4, type: Enums.TagType.context },
        });

        return {
            id: propId,
            index: propIndex,
            values: propValues,
            priority: propPriority,
        };
    }

    /**
     * Reads BACnet properties from buffer of the reader.
     *
     * @return {Map<string, any>}
     */
    static readProperties (reader: BACnetReader, opts?: Interfaces.ReaderOptions): Interfaces.PropertyValue[] {
        // Context Number - Context tag - "Opening" Tag
        const openTag = reader.readTag(opts);

        const params: Interfaces.PropertyValue[] = [];
        while (true) {
            const paramValueTag = reader.readTag({ silent: true });

            if (reader.isClosingTag(paramValueTag)) {
                // Context Number - Context tag - "Closing" Tag
                break;
            }

            const param = this.readProperty(reader, opts);

            params.push(param);
        }

        return params;
    }

    /**
     * Reads the list of BACnet property values from buffer of the reader.
     *
     * @return {Map<string, any>}
     */
    static readPropertyValues (reader: BACnetReader, opts?: Interfaces.ReaderOptions): BACnetTypes.BACnetTypeBase[] {
        // Context Number - Context tag - "Opening" Tag
        const openTag = reader.readTag(opts);

        const paramValues: BACnetTypes.BACnetTypeBase[] = [];
        while (true) {
            const paramValueTag = reader.readTag({ silent: true });

            if (reader.isClosingTag(paramValueTag)) {
                // Context Number - Context tag - "Closing" Tag
                break;
            }
            const paramValueType: Enums.PropertyType = paramValueTag.num;

            let inst: BACnetTypes.BACnetTypeBase;
            switch (paramValueType) {
                case Enums.PropertyType.boolean:
                    inst = new BACnetTypes.BACnetBoolean();
                    break;
                case Enums.PropertyType.unsignedInt:
                    inst = new BACnetTypes.BACnetUnsignedInteger();
                    break;
                case Enums.PropertyType.real:
                    inst = new BACnetTypes.BACnetReal();
                    break;
                case Enums.PropertyType.characterString:
                    inst = new BACnetTypes.BACnetCharacterString();
                    break;
                case Enums.PropertyType.bitString:
                    inst = new BACnetTypes.BACnetStatusFlags();
                    break;
                case Enums.PropertyType.enumerated:
                    inst = new BACnetTypes.BACnetEnumerated();
                    break;
                case Enums.PropertyType.objectIdentifier:
                    inst = new BACnetTypes.BACnetObjectId();
                    break;
            }
            inst.readValue(reader, opts);

            paramValues.push(inst);
        }

        return paramValues;
    }
}

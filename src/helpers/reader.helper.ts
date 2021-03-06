import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import * as IOs from '../io';

export class Reader {
    /**
     * Reads BACnet property from buffer of the reader.
     *
     * @return {Map<string, any>}
     */
    static readProperty (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): Interfaces.PropertyValue {
        // Read first tag to get first context number
        const firstTag = reader.readTag({ silent: true });

        // Read property ID
        const propId = BACnetTypes.BACnetEnumerated.readParam(reader);

        // Read property index
        const propIndex = BACnetTypes.BACnetUnsignedInteger.readParam(reader, {
            optional: true,
            tag: { num: firstTag.num + 1, type: Enums.TagType.context },
        });

        // Read property values
        const propValues = Reader.readPropertyValues(reader, opts);

        // Read property priority
        const propPriority = BACnetTypes.BACnetUnsignedInteger.readParam(reader, {
            optional: true,
            tag: { num: firstTag.num + 3, type: Enums.TagType.context },
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
    static readProperties (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): Interfaces.PropertyValue[] {
        // Context Number - Context tag - "Opening" Tag
        const openingTag = reader.readTag(opts);

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

        const closingTag = reader.readTag();

        return params;
    }

    /**
     * Reads the list of BACnet property values from buffer of the reader.
     *
     * @return {Map<string, any>}
     */
    static readPropertyValues (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetTypes.BACnetTypeBase[] {
        // Context Number - Context tag - "Opening" Tag
        const openingTag = reader.readTag(opts);

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
                case Enums.PropertyType.nullData:
                    inst = new BACnetTypes.BACnetNull();
                    break;
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

        const closingTag = reader.readTag();

        return paramValues;
    }
}

import {
    BACnetPropertyId,
    BACnetTagTypes,
} from '../enums';

import * as BACnetTypes from '../types';

export namespace BACnet {
    export interface PropertyValue {
        id: BACnetTypes.BACnetEnumerated;
        index?: BACnetTypes.BACnetUnsignedInteger;
        values?: BACnetTypes.BACnetTypeBase[];
        priority?: BACnetTypes.BACnetUnsignedInteger;
    }

    export interface Tag {
        num: number;
        type: BACnetTagTypes;
        value?: number;
    }

    export namespace Type {
        export interface ObjectId {
            type: number; // enum
            instance: number;
        }

        export interface StatusFlags {
            inAlarm?: boolean,
            fault?: boolean,
            overridden?: boolean,
            outOfService?: boolean,
        }
    }
}

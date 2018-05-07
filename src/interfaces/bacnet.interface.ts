import * as Enums from '../enums';

import * as BACnetTypes from '../types';

export interface PropertyValue {
    id: BACnetTypes.BACnetEnumerated;
    index?: BACnetTypes.BACnetUnsignedInteger;
    values?: BACnetTypes.BACnetTypeBase[];
    priority?: BACnetTypes.BACnetUnsignedInteger;
}

export interface Tag {
    num: number;
    type: Enums.TagType;
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

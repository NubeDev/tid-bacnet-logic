import {
    BACnetPropertyId,
    BACnetTagTypes,
} from '../enums';

import * as BACnetTypes from '../types';

export interface IBACnetReaderOptions {
    optional?: boolean;
    silent?: boolean;
}

export interface IBACnetPropertyValue {
    id: BACnetTypes.BACnetEnumerated;
    index?: BACnetTypes.BACnetUnsignedInteger;
    values?: BACnetTypes.BACnetTypeBase[];
    priority?: BACnetTypes.BACnetUnsignedInteger;
}

export interface IBACnetTag {
    num: number;
    type: BACnetTagTypes;
    value?: number;
}


/**
 * Types
 */

export interface IBACnetTypeObjectId {
    type: number; // enum
    instance: number;
}

export interface IBACnetTypeStatusFlags {
    inAlarm?: boolean,
    fault?: boolean,
    overridden?: boolean,
    outOfService?: boolean,
}

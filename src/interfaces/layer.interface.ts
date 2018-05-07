import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import * as BACnet from './bacnet.interface';

import { BACnetWriter } from '../io';

export interface Layers {
    blvc: BLVC.Read.Layer;
    npdu: NPDU.Read.Layer;
    apdu: APDU.Read.Layer;
}

export namespace BLVC {
    export namespace Read {
        export interface Layer {
            type: number;
            func: Enums.BLVCFunction;
            length: number;
            npdu: NPDU.Read.Layer;
        }
    }

    export namespace Write {
        export interface Layer {
            func: Enums.BLVCFunction;
            npdu: BACnetWriter;
            apdu: BACnetWriter;
        }
    }
}

export namespace NPDU {
    export namespace Read {
        export interface Layer {
            version: number;
            control: Control;
            dest: NetworkDest;
            src: NetworkSrc;
            apdu: APDU.Read.Layer;
        }

        export interface Control {
            noApduMessageType: boolean;
            reserved1: number;
            destSpecifier: boolean;
            reserved2: number;
            srcSpecifier: boolean;
            expectingReply: boolean;
            priority1: number;
            priority2: number;
        }

        export interface Network {
            networkAddress: number;
            macAddressLen: number;
            macAddress?: string;
        }

        export interface NetworkDest
                extends Network {
            hopCount?: number;
        }

        export interface NetworkSrc
                extends Network {
        }
    }

    export namespace Write {
        export interface Layer {
            control?: Control;
            destNetworkAddress?: number;
            destMacAddress?: string;
            srcNetworkAddress?: number;
            srcMacAddress?: string;
            hopCount?: number;
        }

        export interface Control {
            noApduMessageType?: boolean;
            destSpecifier?: boolean;
            srcSpecifier?: boolean;
            expectingReply?: boolean;
            priority1?: number;
            priority2?: number;
        }
    }

}

export namespace APDU {
    export namespace Read {
        export type Layer = ConfirmedRequest.Read.Layer | UnconfirmedRequest.Read.Layer
            | ComplexACK.Read.Layer | SimpleACK.Read.Layer;
    }
}

export namespace ConfirmedRequest {
    export namespace Read {
        export interface Layer {
            type: Enums.ServiceType;
            seg: boolean;
            mor: boolean;
            sa: boolean;
            maxSegs: number;
            maxResp: number;
            invokeId: number;
            serviceChoice: Enums.ConfirmedServiceChoice;
            service: ServiceChoice;
        }

        export type ServiceChoice = ReadProperty | SubscribeCOV | WriteProperty;

        export interface ReadProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }

        export interface WriteProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }

        export interface SubscribeCOV {
            objId: BACnetTypes.BACnetObjectId;
            subProcessId: BACnetTypes.BACnetUnsignedInteger;
            issConfNotif: BACnetTypes.BACnetBoolean;
            lifetime: BACnetTypes.BACnetUnsignedInteger;
        }
    }

    export namespace Write {
        export interface Layer {
            segAccepted?: boolean;
            invokeId: number;
        }

        export interface ReadProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }

        export interface WriteProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }

        export interface SubscribeCOV {
            subProcessId: BACnetTypes.BACnetUnsignedInteger;
            objId: BACnetTypes.BACnetObjectId;
            issConfNotif: BACnetTypes.BACnetBoolean;
            lifetime: BACnetTypes.BACnetUnsignedInteger;
        }

        export interface UnsubscribeCOV {
            subProcessId: BACnetTypes.BACnetUnsignedInteger;
            objId: BACnetTypes.BACnetObjectId;
        }
    }

    export namespace Service {
        export interface ReadProperty
            extends ConfirmedRequest.Write.Layer, ConfirmedRequest.Write.ReadProperty {
        }

        export interface WriteProperty
            extends ConfirmedRequest.Write.Layer, ConfirmedRequest.Write.WriteProperty {
        }

        export interface SubscribeCOV
            extends ConfirmedRequest.Write.Layer, ConfirmedRequest.Write.SubscribeCOV {
        }

        export interface UnsubscribeCOV
            extends ConfirmedRequest.Write.Layer, ConfirmedRequest.Write.UnsubscribeCOV {
        }
    }
}

export namespace UnconfirmedRequest {
    export namespace Read {
        export interface Layer {
            type: Enums.ServiceType;
            serviceChoice: Enums.UnconfirmedServiceChoice;
            service: ServiceChoice;
        }

        export type ServiceChoice = IAm | WhoIs | COVNotification;

        export interface IAm {
            objId: BACnetTypes.BACnetObjectId;
            maxAPDUlength: BACnetTypes.BACnetUnsignedInteger;
            segmSupported: BACnetTypes.BACnetEnumerated;
            vendorId: BACnetTypes.BACnetUnsignedInteger;
        }

        export interface WhoIs {
        }

        export interface COVNotification {
            // Identify the process within the COV client.
            subProcessId: BACnetTypes.BACnetUnsignedInteger;
            // Device that initiated the `COV Notification` service request
            devId: BACnetTypes.BACnetObjectId;
            // Object that has changed
            objId: BACnetTypes.BACnetObjectId;
            // Remaining lifetime of the subscription in seconds. 00 - indefinite lifetime
            timeRemaining: BACnetTypes.BACnetUnsignedInteger;
            // List of one or more `notification` property values
            listOfValues: BACnet.PropertyValue[];
        }
    }

    export namespace Write {
        export interface Layer {
        }

        export interface WhoIs {
        }

        export interface IAm {
            objId: BACnetTypes.BACnetObjectId;
            vendorId: BACnetTypes.BACnetUnsignedInteger;
        }

        export interface COVNotification {
            subProcessId: BACnetTypes.BACnetUnsignedInteger;
            devId: BACnetTypes.BACnetObjectId;
            objId: BACnetTypes.BACnetObjectId;
            timeRemaining?: BACnetTypes.BACnetUnsignedInteger;
            listOfValues: BACnet.PropertyValue[];
        }
    }

    export namespace Service {
        export interface COVNotification
            extends UnconfirmedRequest.Write.Layer, UnconfirmedRequest.Write.COVNotification {
        }
        export interface WhoIs
            extends UnconfirmedRequest.Write.Layer, UnconfirmedRequest.Write.WhoIs {
        }
        export interface IAm
            extends UnconfirmedRequest.Write.Layer, UnconfirmedRequest.Write.IAm {
        }
    }
}

export namespace ComplexACK {
    export namespace Read {
        export interface Layer {
            type: Enums.ServiceType;
            seg: boolean;
            mor: boolean;
            invokeId: number;
            sequenceNumber: number;
            proposedWindowSize: number;
            serviceChoice: Enums.ConfirmedServiceChoice;
            service: ServiceChoice;
        }

        export type ServiceChoice = ReadProperty;

        export interface ReadProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }
    }

    export namespace Write {
        export interface Layer {
            seg?: boolean;
            mor?: boolean;
            invokeId: number;
        }

        export interface ReadProperty {
            objId: BACnetTypes.BACnetObjectId;
            prop: BACnet.PropertyValue;
        }
    }

    export namespace Service {
        export interface ReadProperty
            extends ComplexACK.Write.Layer, ComplexACK.Write.ReadProperty {
        }
    }
}

export namespace SimpleACK {
    export namespace Read {
        export interface Layer {
            type: Enums.ServiceType;
            invokeId: number;
            serviceChoice: Enums.ConfirmedServiceChoice;
            service: ServiceChoice;
        }

        export type ServiceChoice = SubscribeCOV | WriteProperty;

        export interface SubscribeCOV {
        }

        export interface WriteProperty {
        }
    }

    export namespace Write {
        export interface Layer {
            invokeId: number;
        }

        export interface SubscribeCOV {
        }

        export interface WriteProperty {
        }
    }

    export namespace Service {
        export interface SubscribeCOV
            extends SimpleACK.Write.Layer, SimpleACK.Write.SubscribeCOV {
        }

        export interface WriteProperty
            extends SimpleACK.Write.Layer, SimpleACK.Write.WriteProperty {
        }
    }
}

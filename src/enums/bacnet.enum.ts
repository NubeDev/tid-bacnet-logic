
/**
 * Services
 */
export namespace BACnet {
    export enum BLVCFunction {
        originalUnicastNPDU = 0x0a,
        originalBroadcastNPDU = 0x0b,
    }

    export enum ConfirmedServiceChoice {
        SubscribeCOV = 0x05,
        ReadProperty = 0x0c,
        ReadPropertyMultiple = 0x0e,
        WriteProperty = 0x0f,
        WritePropertyMultiple = 0x10,
    }

    export enum UnconfirmedServiceChoice {
        iAm = 0x00,
        iHave = 0x01,
        covNotification = 0x02,
        eventNotification = 0x03,
        whoHas = 0x07,
        whoIs = 0x08,
    }

    export enum ServiceType {
        ConfirmedReqPDU = 0x00,
        UnconfirmedReqPDU = 0x01,
        SimpleACKPDU = 0x02,
        ComplexACKPDU = 0x03,
        SegmentACKPDU = 0x04,
        ErrorPDU = 0x05,
        RejectPDU = 0x06,
        AbortPDU = 0x07,
    }
}

/**
 * Objects
 */
export namespace BACnet {
    export enum ObjectType {
        AnalogInput = 0,
        AnalogOutput = 1,
        AnalogValue = 2,
        BinaryInput = 3,
        BinaryOutput = 4,
        BinaryValue = 5,
        Calendar = 6,
        Command = 7,
        Device = 8,
        EventEnrollment = 9,
        File = 10,
        Group = 11,
        Loop = 12,
        MultiStateInput = 13,
        MultiStateOutput = 14,
        NotificationClass = 15,
        Program = 16,
        Schedule = 17,
        Averaging = 18,
        MultiStateValue = 19,
        TrendLog = 20,
        LifeSafetyPoint = 21,
        LifeSafetyZone = 22,
        Accumulator = 23,
        PulseConverter = 24,
        EventLog = 25,
        GlobalGroup = 26,
        TrendLogMultiple = 27,
        LoadControl = 28,
        StructuredView = 29,
        AccessDoor = 30,
        Timer = 31,
        AccessCredential = 32,
        AccessPoint = 33,
        AccessRights = 34,
        AccessUser = 35,
        AccessZone = 36,
        CredentialDataInput = 37,
        NetworkSecurity = 38,
        BitstringValue = 39,
        CharacterStringValue = 40,
        DatepatternValue = 41,
        DateValue = 42,
        DatetimepatternValue = 43,
        DatetimeValue = 44,
        IntegerValue = 45,
        LargeAnalogValue = 46,
        OctetstringValue = 47,
        PositiveIntegerValue = 48,
        TimepatternValue = 49,
        TimeValue = 50,
        NotificationForwarder = 51,
        AlertEnrollment = 52,
        Channel = 53,
        LightingOutput = 54,
        BinaryLightingOutput = 55,
        NetworkPort = 56,
        ElevatorGroup = 57,
        Escalator = 58,
        Lift = 59,
    }

    export enum PropertyId {
        apduSegmentTimeout = 10,
        apduTimeout = 11,
        applicationSoftwareVersion = 12,
        changeOfStateCount = 15,
        changeOfStateTime = 16,
        covIncrement = 22,
        description = 28,
        deviceAddressBinding = 30,
        elapsedActiveTime = 33,
        eventState = 36,
        firmwareRevision = 44,
        localDate = 56,
        localTime = 57,
        maxApduLengthAccepted = 62,
        maxInfoFrames = 63,
        maxMaster = 64,
        maxPresValue = 65,
        minimumOffTime = 66,
        minimumOnTime = 67,
        minPresValue = 69,
        modelName = 70,
        numberOfApduRetries = 73,
        numberOfStates = 74,
        objectIdentifier = 75,
        objectList = 76,
        objectName = 77,
        objectType = 79,
        outOfService = 81,
        polarity = 84,
        presentValue = 85,
        priorityArray = 87,
        protocolObjectTypesSupported = 96,
        protocolServicesSupported = 97,
        protocolVersion = 98,
        reliability = 103,
        relinquishDefault = 104,
        segmentationSupported = 107,
        stateText = 110,
        statusFlags = 111,
        systemStatus = 112,
        vendorIdentifier = 120,
        vendorName = 121,
        timeOfActiveTimeReset = 114,
        timeOfStateCountReset = 115,
        units = 117,
        protocolRevision = 139,
        databaseRevision = 155,
        currentCommandPriority = 431,
    }
}

/**
 * Properties
 */
export namespace BACnet {
    export enum TagType {
        application = 0,
        context = 1,
    }

    export enum PropertyType {
        nullData = 0,
        boolean = 1,
        unsignedInt = 2,
        real = 4,
        characterString = 7,
        bitString = 8,
        enumerated = 9,
        objectIdentifier = 12,
    }

    export enum BinaryPV {
        Inactive = 0,
        Active = 1,
    }

    export enum Polarity {
        Normal = 0,
        Reverse = 1,
    }

    export enum EventState {
        Normal = 0,
        Fault = 1,
        Offnormal = 2,
        HighLimit = 3,
        LowLimit = 4,
        LifeSafetyAlarm = 5,
    }

    export enum Reliability {
        NoFaultDetected = 0,
        NoSensor = 1,
        OverRange = 2,
        UnderRange = 3,
        OpenLoop = 4,
        ShortedLoop = 5,
        NoOutput = 6,
        UnreliableOther = 7,
        ProcessError = 8,
        MultiStateFault = 9,
        ConfigurationError = 10,
        CommunicationFailure = 12,
        MemberFault = 13,
        MonitoredObjectFault = 14,
        Tripped = 15,
        LampFailure = 16,
        ActivationFailure = 17,
        RenewDhcpFailure = 18,
        RenewFdRegistrationFailure = 19,
        RestartAutoNegotiationFailure = 20,
        RestartFailure = 21,
        ProprietaryCommandFailure = 22,
        FaultsListed = 23,
        referencedObjectFault = 24,
    }

    export enum EngineeringUnits {
        metersPerSecondPerSecond = 166,
        // Area
        squareMeters = 0,
        squareCentimeters = 116,
        squareFeet = 1,
        squareInches = 115,
        // Currency
        currency1 = 105,
        currency2 = 106,
        currency3 = 107,
        currency4 = 108,
        currency5 = 109,
        currency6 = 110,
        currency7 = 111,
        currency8 = 112,
        currency9 = 113,
        currency10 = 114,
        // Electrical
        milliamperes = 2,
        amperes = 3,
        amperesPerMeter = 167,
        amperesPerSquareMeter = 168,
        ampereSquareMeters = 169,
        decibels = 199,
        decibelsMillivolt = 200,
        decibelsVolt = 201,
        farads = 170,
        henrys = 171,
        ohms = 4,
        ohmMeterSquaredPerMeter = 237,
        ohmMeters = 172,
        kilohms = 122,
        megohms = 123,
        microsiemens = 190,
        millisiemens = 202,
        siemens = 173,
        siemensPerMeter = 174,
        teslas = 175,
        volts = 5,
        millivolts = 124,
        kilovolts = 6,
        megavolts = 7,
        voltAmperes = 8,
        kilovoltAmperes = 9,
        megavoltAmperes = 10,
        voltAmperesReactive = 11,
        kilovoltAmperesReactive = 12,
        megavoltAmperesReactive = 13,
        voltsPerDegreeLelvin = 176,
        voltsPerMeter = 177,
        degreesPhase = 14,
        powerFactor = 15,
        webers = 178,
        // Other
        noUnits = 95,
    }
}

import * as _ from 'lodash';

import { blvc, npdu, apdu } from '../layers';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

export class Common {

    /**
     * Converts the `BACnet message` with `Buffer` type to the `Layer` entity
     * using the `layer` logic.
     *
     * @param  {Buffer} buf - buffer with BACnet message
     * @return {Interfaces.ILayerLogic}
     */
    static bufferToLayer (buf: Buffer): Interfaces.Layers {
        let blvcMessage = blvc.getFromBuffer(buf);
        return {
            blvc: blvcMessage,
            npdu: _.get(blvcMessage, 'npdu'),
            apdu: _.get(blvcMessage, 'npdu.apdu'),
        };
    }

    /**
     * Searches the property by property ID.
     *
     * @param  {Interfaces.PropertyValue[]} props - list of properties
     * @param  {Enums.PropertyId} propId - property ID
     * @return {Interfaces.PropertyValue}
     */
    static findPropById (props: Interfaces.PropertyValue[],
            propId: Enums.PropertyId): Interfaces.PropertyValue {
        return _.find(props, (prop) => {
            return prop.id.value === propId;
        });
    }
}

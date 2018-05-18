import * as _ from 'lodash';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as Types from '../types';

import * as Layers from '../layers';

import * as IOs from '../io';

export class Layer {

    /**
     * Converts the `BACnet message` to the `Layer` entity.
     *
     * @param  {Buffer} buf - buffer with BACnet message
     * @return {Interfaces.Layers}
     */
    static bufferToLayer (buf: Buffer): Interfaces.Layers {
        const reader = new IOs.Reader(buf);
        let blvcMessage = Layers.Reader.BLVC.readLayer(reader);
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

    /**
     * Extracts the value of the property from the BACnet layer.
     *
     * @template T {extends Types.BACnetTypeBase}
     * @param  {Interfaces.Layers} layer - BACnet layer (plain object)
     * @return {T|T[]}
     */
    public getPropertyValue <T extends Types.BACnetTypeBase> (
            layer: Interfaces.Layers): T|T[] {
        const prop: Interfaces.PropertyValue =
            _.get(layer, 'apdu.service.prop', null);

        if (!_.has(prop, 'values') || !_.isArray(prop.values)) {
            return null;
        }

        const propValues = prop.values as T[];
        return propValues.length === 1
            ? propValues[0] : propValues;
    }
}

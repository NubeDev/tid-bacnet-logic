import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import { BACnetWriter } from '../io';

export class BACnetWriterUtil {
    /**
     * Writes BACnet property to the buffer of the writer.
     *
     * @param  {BACnetWriter} writer - instance of the `writer`
     * @param  {IBACnetPropertyValue} prop - BACnet property
     * @return {Map<string, any>}
     */
    static writeProperty (writer: BACnetWriter, prop: Interfaces.BACnet.PropertyValue): void {
        prop.id.writeParam(writer, { num: 0, type: Enums.BACnetTagTypes.context });

        if (prop.index) {
            prop.index.writeParam(writer, { num: 1, type: Enums.BACnetTagTypes.context });
        }

        this.writeValue(writer, prop.values, { num: 2, type: Enums.BACnetTagTypes.context });

        if (prop.priority) {
            prop.priority.writeParam(writer, { num: 3, type: Enums.BACnetTagTypes.context });
        }
    }
    /**
     * Writes BACnet properties to the buffer of the writer.
     *
     * @param  {BACnetWriter} writer - instance of the `writer`
     * @param  {IBACnetPropertyValue[]} props - BACnet properties
     * @param  {Interfaces.BACnet.Tag} tag - BACnet tag
     * @return {void}
     */
    static writeProperties (writer: BACnetWriter, props: Interfaces.BACnet.PropertyValue[], tag: Interfaces.BACnet.Tag): void {
        // Write opening tag for list of properties
        writer.writeTag(tag.num, tag.type, 6);

        _.map(props, (prop) => {
            this.writeProperty(writer, prop);
        });

        // Write closing tag for list of properties
        writer.writeTag(tag.num, tag.type, 7);
    }

    /**
     * Writes BACnet property value to the buffer of the writer.
     *
     * @param  {BACnetWriter} writer - instance of the `writer`
     * @param  {BACnetTypes.BACnetTypeBase|BACnetTypes.BACnetTypeBase[]} propValues - BACnet property value
     * @param  {Interfaces.BACnet.Tag} tag - BACnet tag
     * @return {void}
     */
    static writeValue (writer: BACnetWriter, propValues: BACnetTypes.BACnetTypeBase | BACnetTypes.BACnetTypeBase[],
            tag: Interfaces.BACnet.Tag): void {
        // Context Number - Context tag - "Opening" Tag
        writer.writeTag(tag.num, tag.type, 6);

        let values: BACnetTypes.BACnetTypeBase[] = _.isArray(propValues)
            ? propValues : [ propValues ];

        _.map(values, (value) => {
            value.writeValue(writer);
        });

        // Context Number - Context tag - "Closing" Tag
        writer.writeTag(tag.num, tag.type, 7);
    }
}

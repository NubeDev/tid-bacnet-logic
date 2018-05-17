import * as _ from 'lodash';

import * as Errors from '../errors';

import * as Interfaces from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import * as IOs from '../io';

export class Writer {
    /**
     * Writes BACnet property to the buffer of the writer.
     *
     * @param  {IOs.Writer} writer - instance of the `writer`
     * @param  {IBACnetPropertyValue} prop - BACnet property
     * @return {Map<string, any>}
     */
    static writeProperty (writer: IOs.Writer, prop: Interfaces.PropertyValue): void {
        prop.id.writeParam(writer, { num: 0, type: Enums.TagType.context });

        if (prop.index) {
            prop.index.writeParam(writer, { num: 1, type: Enums.TagType.context });
        }

        this.writeValue(writer, prop.values, { num: 2, type: Enums.TagType.context });

        if (prop.priority) {
            prop.priority.writeParam(writer, { num: 3, type: Enums.TagType.context });
        }
    }
    /**
     * Writes BACnet properties to the buffer of the writer.
     *
     * @param  {IOs.Writer} writer - instance of the `writer`
     * @param  {IBACnetPropertyValue[]} props - BACnet properties
     * @param  {Interfaces.Tag} tag - BACnet tag
     * @return {void}
     */
    static writeProperties (writer: IOs.Writer, props: Interfaces.PropertyValue[], tag: Interfaces.Tag): void {
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
     * @param  {IOs.Writer} writer - instance of the `writer`
     * @param  {BACnetTypes.BACnetTypeBase|BACnetTypes.BACnetTypeBase[]} propValues - BACnet property value
     * @param  {Interfaces.Tag} tag - BACnet tag
     * @return {void}
     */
    static writeValue (writer: IOs.Writer, propValues: BACnetTypes.BACnetTypeBase | BACnetTypes.BACnetTypeBase[],
            tag: Interfaces.Tag): void {
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

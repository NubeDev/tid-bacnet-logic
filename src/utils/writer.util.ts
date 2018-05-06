import * as _ from 'lodash';

import * as Errors from '../errors';

import {
    IBACnetPropertyValue,
    IBACnetReaderOptions,
    IBACnetTag,
} from '../interfaces';

import * as Enums from '../enums';

import * as BACnetTypes from '../types';

import { BACnetWriter } from '../io';

export class BACnetWriterUtil {
    /**
     * Writes BACnet property value to the buffer of the writer.
     *
     * @param  {BACnetWriter} writer - instance of the `writer`
     * @param  {BACnetTypes.BACnetTypeBase|BACnetTypes.BACnetTypeBase[]} propValues - bacnet property value
     * @param  {IBACnetTag} tag - bacnet tag
     * @return {void}
     */
    static writeValue (writer: BACnetWriter, propValues: BACnetTypes.BACnetTypeBase | BACnetTypes.BACnetTypeBase[],
            tag: IBACnetTag): void {
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

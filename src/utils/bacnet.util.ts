import * as _ from 'lodash';

import { blvc, npdu, apdu } from '../layers';

import * as Interfaces from '../interfaces';

import * as BACnetTypes from '../types';

export class BACnetUtil {

    /**
     * Converts the `BACnet message` with `Buffer` type to the `Layer` entity
     * using the `layer` logic.
     *
     * @param  {Buffer} buf - buffer with BACnet message
     * @return {Interfaces.ILayerLogic}
     */
    static bufferToLayer (buf: Buffer): Interfaces.ILayerLogic {
        let blvcMessage = blvc.getFromBuffer(buf);
        return {
            blvc: blvcMessage,
            npdu: _.get(blvcMessage, 'npdu'),
            apdu: _.get(blvcMessage, 'npdu.apdu'),
        };
    }
}

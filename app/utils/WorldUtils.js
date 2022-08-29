import React from 'react';

import lo from 'lodash';

const WORLDS = ['尘界', '现实', '灵修界']; // 对应worldId: 0, 1, 2

export default class WorldUtils {

    static getWorldIdByName(name) {
        return lo.indexOf(WORLDS, lo.trim(name));
    }

    static getWorldNameById(worldId) {
        return WORLDS[worldId];
    }

    static isValidWorldId(worldId) {
        return lo.isNumber(worldId) && (worldId >= 0 && worldId <= 2);
    }

}
import {
    animationAction,
    SHCOK,
    EDGE_LIGHT,
    SCREEN_CENTER_STRETCH,
    FLASH_BUXUE,
    ONOMATOPOEIA,
    KNIFELIGHT
} from '../../constants';

import EdgeLightModal from "./EdgeLight";
import Shock from '../shock';
import ScreenCenterStretchModal from './ScreenCenterStretch';
import FlashBuXueModal from './FlashBuXue';
import Onomatopoeia from './onomatopoeia/index';
import KnifeLightEffects from './knifeLightEffects'

export default function Animation(animation) {
    const actionObj = animationAction(animation)
    if (actionObj === null) return null

    switch (actionObj.type) {
        case SHCOK:
            return Shock.shockShow(actionObj.action)
        case EDGE_LIGHT:
            return EdgeLightModal.show(actionObj.action)
        case SCREEN_CENTER_STRETCH:
            return ScreenCenterStretchModal.show(actionObj.action)
        case FLASH_BUXUE:
            return FlashBuXueModal.show(actionObj.action)
        case ONOMATOPOEIA:
            return Onomatopoeia(actionObj)
        case KNIFELIGHT:
            return KnifeLightEffects(actionObj.action)

    }
};
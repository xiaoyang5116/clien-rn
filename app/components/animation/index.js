import {
    animationAction,
    SHCOK,
    EDGE_LIGHT,
    SCREEN_CENTER_STRETCH,
    FLASH_BUXUE,
    ONOMATOPOEIA
} from '../../constants';
import EdgeLightModal from "./EdgeLight";
import Shock from '../shock';
import ScreenCenterStretchModal from './ScreenCenterStretch';
import FlashBuXueModal from './FlashBuXue';
import Onomatopoeia from './onomatopoeia/index';

export default function Animation(animation) {
    const acitonObj = animationAction(animation)
    switch (acitonObj.type) {
        case SHCOK:
            return Shock.shockShow(acitonObj.action)
        case EDGE_LIGHT:
            return EdgeLightModal.show(acitonObj.action)
        case SCREEN_CENTER_STRETCH:
            return ScreenCenterStretchModal.show(acitonObj.action)
        case FLASH_BUXUE:
            return FlashBuXueModal.show(acitonObj.action)
        case ONOMATOPOEIA:
            return Onomatopoeia(acitonObj)

    }
};
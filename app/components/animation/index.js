import {
    animationAction,
    SHCOK,
    EDGE_LIGHT,
    SCREEN_CENTER_STRETCH,
    FLASH_BUXUE,
    BOOM
} from '../../constants';
import EdgeLightModal from "./EdgeLight";
import Shock from '../shock';
import ScreenCenterStretchModal from './ScreenCenterStretch';
import FlashBuXueModal from './FlashBuXue';
import BoomModel from './Boom';

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
        case BOOM:
            return BoomModel.show(acitonObj.action)

    }
};
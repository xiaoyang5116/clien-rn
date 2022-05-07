import {
    animationAction,
    SHCOK,
    EDGE_LIGHT,
    SCREEN_CENTER_STRETCH,
} from '../../constants';
import EdgeLightModal from "./EdgeLight";
import Shock from '../shock';
import ScreenCenterStretchModal from './ScreenCenterStretch';


export default function Animation(animationList) {
    animationList.forEach(item => {
        const acitonObj = animationAction(item)
        switch (acitonObj.type) {
            case SHCOK:
                return Shock.shockShow(acitonObj.action)
            case EDGE_LIGHT:
                return EdgeLightModal.show(acitonObj.action)
            case SCREEN_CENTER_STRETCH:
                return ScreenCenterStretchModal.show(acitonObj.action)
        }
    });
};
import React from 'react';
import RootView from "../RootView";
import BarrageAnimation from './BarrageAnimation';
import CloudAnimation from './CloudAnimation';
import BothSidesPushEffect from '../animation/BothSidesPushEffect'
import LightningAnimation from './LightningAnimation';
import LeiYunAnimation from './LeiYunAnimation';

export default class EffectAnimations {

    static show(params) {
        const { id } = params;
        if (id == 1) { // 云雾
            const key = RootView.add(<CloudAnimation onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 2) { // 弹幕
            const key = RootView.add(<BarrageAnimation data={params.data} onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 3) { // 闪电
            const key = RootView.add(<LightningAnimation rotate={params.rotate} onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 4) { // 自动推开两边云彩
            BothSidesPushEffect.show()
        } else if (id == 5) { // 雷云
            const key = RootView.add(<LeiYunAnimation onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }

}

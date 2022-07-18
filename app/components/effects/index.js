import React from 'react';
import RootView from "../RootView";
import BarrageAnimation from './BarrageAnimation';
import CloudAnimation from './CloudAnimation';

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
        }
    }

}

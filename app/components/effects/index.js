import React from 'react';
import RootView from "../RootView";
import CloudAnimation from './CloudAnimation';

export default class EffectAnimations {

    static show(params) {
        const { id } = params;
        if (id == 1) { // 云雾
            const key = RootView.add(<CloudAnimation onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }

}

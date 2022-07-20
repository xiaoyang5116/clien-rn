import React from 'react';
import RootView from "../RootView";
import lo from 'lodash';

import BarrageAnimation from './BarrageAnimation';
import CloudAnimation from './CloudAnimation';
import BothSidesPushEffect from '../animation/BothSidesPushEffect'
import LightningAnimation from './LightningAnimation';
import LeiYunAnimation from './LeiYunAnimation';

export default class EffectAnimations {

    static show(params) {
        let items = [];
        if (lo.isArray(params)) {
            items.push(...params);
        } else {
            items.push(params);
        }


        items.forEach(e => {
            const { id } = e;
            if (id == 1) { // 云雾
                const key = RootView.add(<CloudAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 2) { // 弹幕
                const key = RootView.add(<BarrageAnimation data={e.data} onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 3) { // 闪电
                const key = RootView.add(<LightningAnimation rotate={e.rotate} onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 4) { // 自动推开两边云彩
                BothSidesPushEffect.show()
            } else if (id == 5) { // 雷云
                const key = RootView.add(<LeiYunAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            }
        });
    }

}

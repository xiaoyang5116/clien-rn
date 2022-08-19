import React from 'react';
import RootView from "../RootView";
import lo from 'lodash';

import BarrageAnimation from './BarrageAnimation';
import CloudAnimation from './CloudAnimation';
import BothSidesPushEffect from '../animation/BothSidesPushEffect'
import LightningAnimation from './LightningAnimation';
import LeiYunAnimation from './LeiYunAnimation';
import Onomatopoeia from '../animation/onomatopoeia';
import SubTitleAnimation from './SubTitleAnimation';
import Animation from '../animation';
import XueHuaAnimation from './XueHuaAnimation';
import FlyAnimation from './FlyAnimation';
import WorldPreview from '../carousel/WorldPreview';

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
            } else if (id == 6) { // 拟声词
                Onomatopoeia(e)
            } else if (id == 7) { // 字幕
                const key = RootView.add(<SubTitleAnimation data={e.data} onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 8) { // 其他动画
                Animation(e.type)
            } else if (id == 9) { // 雪花
                const key = RootView.add(<XueHuaAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 10) { // 飞行
                const key = RootView.add(<FlyAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 11) { // 世界切换
                const kvmap = [{ key: '现实', worldId: 0 }, { key: '尘界', worldId: 1 }, { key: '灵修界', worldId: 2 }];
                const found = kvmap.find(kv => lo.isEqual(kv.key, e.data.worldId));
                if (found != undefined) {
                    const key = RootView.add(<WorldPreview 
                        item={{ 
                            worldId: found.worldId, 
                            title: e.data.worldId, 
                            desc: e.data.desc, 
                            toChapter: e.data.toChapter 
                        }} 
                        index={found.worldId} 
                        animation={true}
                        onClose={() => {
                            RootView.remove(key);
                        }}
                    />);
                }
            }
        });
    }

}

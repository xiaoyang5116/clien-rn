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
import ShiKongAnimation from './ShiKongAnimation';
import LevelUpAnimation from './LevelUpAnimation';
import WorldPreview from '../carousel/WorldPreview';
import WorldUtils from '../../utils/WorldUtils';
import WeiXiuAnimation from './WeiXiuAnimation';
import XiuXingLevelAnimation from './XiuXingLevelAnimation';
import WorldSwitchAnimation from './WorldSwitchAnimation';

export default class EffectAnimations {

    static show(params, __sceneId) {
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
                const worldId = WorldUtils.getWorldIdByName(e.data.worldId);
                if (worldId >= 0) {
                    const key = RootView.add(<WorldPreview 
                        item={{
                            worldId: worldId, 
                            title: e.data.worldId,
                            desc: e.data.desc, 
                            toChapter: e.data.toChapter,
                            dialogs: e.data.dialogs,
                            __sceneId: __sceneId,
                            isUseProp: e.data.isUseProp === undefined ? true: e.data.isUseProp,
                            useProps: e.data.useProps,
                            conditions: e.data.conditions === undefined ? [] : e.data.conditions,
                        }}
                        animation={true}
                        onClose={() => {
                            RootView.remove(key);
                        }}
                    />);
                }
            } else if (id == 12) { // 扭转时空
                const key = RootView.add(<ShiKongAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 13) { // 等级升级(已废弃)
                const key = RootView.add(<LevelUpAnimation onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 15) { // 修为值增加
                const key = RootView.add(<WeiXiuAnimation values={e.values} onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 16) { // 修行等级提升
                const key = RootView.add(<XiuXingLevelAnimation period={e.period} level={e.level} onClose={() => {
                    RootView.remove(key);
                }} />);
            } else if (id == 17) { // 切换世界动画
                const attrs = {};
                if (e.worldName != undefined) attrs.worldName = e.worldName;
                if (e.year != undefined) attrs.year = e.year;
                const key = RootView.add(<WorldSwitchAnimation {...attrs} onClose={() => {
                    RootView.remove(key);
                }} />);
            }
        });
    }

}

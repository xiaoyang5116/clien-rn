import React from 'react';
import lo from 'lodash';

import RootView from "../RootView";
import MemoryTraining from './MemoryTraining';
import SpeedClick from "./SpeedClick";
import TouchCat from './TouchCat';
import Scratch from './Scratch';
import CopyBook from './CopyBook'
import { AppDispath } from '../../constants';
import SmashEggs from './SmashEggs'
import SmallUniverseProject from './SmallUniverseProject';
import NauticalExploration from './nauticalExploration';


const afterGameClosed = (params, status) => {
    if (status != undefined) {
        if (status === true) {
            if (lo.isObject(params.success) && lo.isString(params.success.toScene)) {
                AppDispath({ type: 'SceneModel/processActions', payload: { toScene: params.success.toScene } });
            } else if (lo.isObject(params.success) && lo.isString(params.success.toChapter)) {
                AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: params.success.toChapter, __sceneId: params.__sceneId } });
            }
        }
        if (status === false) {
            if (lo.isObject(params.fail) && lo.isString(params.fail.toScene)) {
                AppDispath({ type: 'SceneModel/processActions', payload: { toScene:params.fail.toScene } });
            } else if (lo.isObject(params.fail) && lo.isString(params.fail.toChapter)) {
                AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: params.fail.toChapter, __sceneId: params.__sceneId } });
            }
        }
    }
    else {
        if (lo.isString(params.toScene)) {
            AppDispath({ type: 'SceneModel/processActions', payload: { toScene: params.toScene } });
        } else if (lo.isString(params.toChapter)) {
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: params.toChapter, __sceneId: params.__sceneId } });
        }
    }
}

export default class Games {

    static show(params) {
        const { id } = params;
        if (id == 1) { // 劈砖头
            const key = RootView.add(<SpeedClick onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 2) { // 撸猫
            const key = RootView.add(<TouchCat onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 3) { // 记忆力训练
            const key = RootView.add(<MemoryTraining words={params.words} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 4) {  // 刮刮乐
            const key = RootView.add(<Scratch {...params} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 5) {  // 字帖
            const key = RootView.add(<CopyBook {...params} onClose={(status) => {
                RootView.remove(key);
                afterGameClosed(params, status);
            }} />);
        } else if (id == 6) {  // 砸鸡蛋
            const key = RootView.add(<SmashEggs {...params} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 7) {  // 小宇宙项目
            const key = RootView.add(<SmallUniverseProject {...params} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 8) {  // 航海探索
            const key = RootView.add(<NauticalExploration {...params} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        }
    }

}

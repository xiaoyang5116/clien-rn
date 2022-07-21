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


const afterGameClosed = (params) => {
    if (lo.isString(params.toScene)) {
        AppDispath({ type: 'SceneModel/processActions', payload: { toScene: params.toScene } });
    } else if (lo.isString(params.toChapter)) {
        AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: params.toChapter, __sceneId: params.__sceneId } });
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
            const key = RootView.add(<CopyBook onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        } else if (id == 6) {  // 砸鸡蛋
            const key = RootView.add(<SmashEggs {...params} onClose={() => {
                RootView.remove(key);
                afterGameClosed(params);
            }} />);
        }
    }

}

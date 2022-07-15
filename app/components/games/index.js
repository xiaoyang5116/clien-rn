import React from 'react';
import RootView from "../RootView";
import MemoryTraining from './MemoryTraining';
import SpeedClick from "./SpeedClick";
import TouchCat from './TouchCat';

export default class Games {

    static show(params) {
        const { id } = params;
        if (id == 1) { // 劈砖头
            const key = RootView.add(<SpeedClick onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 2) { // 撸猫
            const key = RootView.add(<TouchCat onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 3) { // 记忆力训练
            const key = RootView.add(<MemoryTraining words={params.words} onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }

}

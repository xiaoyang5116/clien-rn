import React from 'react';
import RootView from "../RootView";
import SpeedClick from "./SpeedClick";
import TouchCat from './TouchCat';
import Scratch from './Scratch';
import CopyBook from './CopyBook'


export default class Games {

    static show(params) {
        const { id } = params;
        if (id == 1) {
            const key = RootView.add(<SpeedClick onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 2) {
            const key = RootView.add(<TouchCat onClose={() => {
                RootView.remove(key);
            }} />);

        } else if (id == 3) {
            // 刮刮乐
            const key = RootView.add(<Scratch onClose={() => {
                RootView.remove(key);
            }} />);
        } else if (id == 4) {
            // 字帖
            const key = RootView.add(<CopyBook onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }

}

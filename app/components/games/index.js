import React from 'react';
import RootView from "../RootView";
import SpeedClick from "./SpeedClick";
import TouchCat from './TouchCat';

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
        }
    }

}

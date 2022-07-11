import React from 'react';
import RootView from "../RootView";
import SpeedClick from "./SpeedClick";

export default class Games {

    static show(params) {
        const { id } = params;
        if (id == 1) {
            const key = RootView.add(<SpeedClick onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }

}

import React from 'react';
import RootView from '../components/RootView';
import XiuXingTabPage from './home/XiuXingTabPage';

export default class OpenUI {

    static open(name) {
        switch (name) {
            case 'XiuXing':
                const key = RootView.add(<XiuXingTabPage onClose={() => {
                    RootView.remove(key);
                }} />);
                break
        }
    }

}
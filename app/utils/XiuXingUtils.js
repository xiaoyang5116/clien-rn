import React from 'react';
import RootView from '../components/RootView';
import Transitions from '../components/transition';
import XiuXingPage from '../pages/home/XiuXingTabPage';

export default class XiuXingUtils {
    static show() {
        const key = RootView.add(
            <Transitions id={'OPEN_XIUXING_UI'}>
                <XiuXingPage onClose={() => { RootView.remove(key); }} />
            </Transitions>
        );
    }
}
import React from 'react';
import RootView from '../components/RootView';
import LotteryPopPage from '../pages/home/lottery/LotteryPopPage';

export default class LotteryUtils {
    static show() {
        const key = RootView.add(<LotteryPopPage onClose={() => {
            RootView.remove(key);
        }} />);
    }
}
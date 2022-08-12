import React from 'react';
import RootView from '../components/RootView';
import MissionBar from '../components/mission/MissionBar';

export default class MissionUtils {
    static showBar() {
        const key = RootView.add(<MissionBar onClose={() => {
            RootView.remove(key);
        }} />);
    }
}
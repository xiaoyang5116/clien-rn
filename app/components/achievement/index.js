import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView'
import AchievementPage from './AchievementPage';

class Achievement {
    static show() {
        const key = RootView.add(
            <AchievementPage onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default Achievement
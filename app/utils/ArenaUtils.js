import React from 'react';
import RootView from '../components/RootView';
import ArenaPage from '../pages/home/ArenaPage';

export default class ArenaUtils {
    static show() {
        const key = RootView.add(
            <ArenaPage onClose={() => { RootView.remove(key); }} />
        );
    }
}
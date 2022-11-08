import React from 'react';
import RootView from '../components/RootView';
import ArenaPage from '../pages/home/ArenaPage';

export default class ArenaUtils {
    static show({ challengeId }) {
        const key = RootView.add(
            <ArenaPage challengeId={challengeId} onClose={() => { RootView.remove(key); }} />
        );
    }
}
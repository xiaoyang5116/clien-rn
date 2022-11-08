import React from 'react';
import RootView from '../components/RootView';
import ArenaPage from '../pages/home/ArenaPage';

export default class ArenaUtils {
    static show({ seqId }) {
        const key = RootView.add(
            <ArenaPage seqId={seqId} onClose={() => { RootView.remove(key); }} />
        );
    }
}
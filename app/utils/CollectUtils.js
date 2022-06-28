import React from 'react';
import RootView from '../components/RootView';
import CollectPage from '../pages/CollectPage';

export default class CollectUtils {
    static show(collectId) {
        const key = RootView.add(<CollectPage collectId={collectId} onClose={() => {
            RootView.remove(key);
        }} />)
    }
}
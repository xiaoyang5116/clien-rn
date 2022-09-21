import React from 'react';
import RootView from '../components/RootView';
import CollectPage from '../pages/CollectPage';
import Transitions from '../components/transition';

export default class CollectUtils {
    static show(collectId) {
        const key = RootView.add(
        <Transitions id={'OPEN_CAI_JI'}>
            <CollectPage collectId={collectId} onClose={() => { RootView.remove(key); }} />
        </Transitions>
        );
    }
}
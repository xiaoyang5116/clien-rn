import React from 'react';
import RootView from '../components/RootView';
import ExplorePage from '../pages/home/ExplorePage';
import PropsPageWrapper from '../pages/home/PropsPageWrapper';
import Transitions from '../components/transition';

export default class PageUtils {

    static openPropsPage() {
        const key = RootView.add(
        <PropsPageWrapper onClose={() => { RootView.remove(key); }} />
        );
    }

    static openExplorePage() {
        const key = RootView.add(
        <Transitions id={'OPEN_EXPLORE'}>
            <ExplorePage onClose={() => { RootView.remove(key); }} />
        </Transitions>
        );
    }
}
import React from 'react';

import lo from 'lodash';
import { DeviceEventEmitter, View } from 'react-native';
import { EventKeys } from '../../constants';
import ExploreMainPage from './explore/ExploreMainPage';
import ExploreMapsPage from './explore/ExploreMapsPage';

const ExplorePage = (props) => {
    const[view, setView] = React.useState(null);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.EXPLORETABPAGE_SHOW, (e) => {
            if (lo.isEqual(e, 'ExploreMapsPage')) {
                setView(
                    <ExploreMapsPage onClose={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                );
            } else if (lo.isEqual(e, 'ExploreMainPage')) {
                setView(
                    <ExploreMainPage onClose={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                );
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        DeviceEventEmitter.emit(EventKeys.EXPLORETABPAGE_SHOW, 'ExploreMapsPage');
    }, []);

    return (
    <View style={{ flex: 1 }}>
        {view}
    </View>
    )
}

export default ExplorePage;

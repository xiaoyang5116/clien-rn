import React from 'react';

import {
    DeviceEventEmitter,
    StyleSheet,
} from "../../constants";

import {
    View,
} from '../../constants/native-ui';

import ComposeTabPage from './ComposeTabPage';
import RootView from '../../components/RootView';

export const ComposePage = (props) => {
    
    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@ComposeMainTabPage.close', () => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={styles.viewContainer}>
            <ComposeTabPage />
        </View>
    );
}

export class ComposeUtils {
    static show() {
        const key = RootView.add(<ComposePage onClose={() => {
            RootView.remove(key);
        }} />);
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#669900',
    },
});
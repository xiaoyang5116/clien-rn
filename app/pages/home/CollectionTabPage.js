import React from 'react';

import {
    AppDispath,
    connect,
    EventKeys,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { 
    DeviceEventEmitter,
    ScrollView, 
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CollectionTabPage = (props) => {

    return (
        <View style={styles.viewContainer}>
        </View>
    );

}

const styles = StyleSheet.create({

    viewContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

});

export default connect((state) => ({ ...state.AppModel }))(CollectionTabPage);
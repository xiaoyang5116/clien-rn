import React, { useEffect, useState } from 'react';

import {
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
} from "../../constants";

import { 
    View, 
    Text, 
    FlatList, 
    SafeAreaView, 
    TouchableWithoutFeedback 
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import ProgressBar from '../../components/ProgressBar';
import FastImage from 'react-native-fast-image';
import Toast from '../../components/toast';

class ExploreMainPopPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <FastImage style={{ flex: 1 }} source={require('../../../assets/explore_bg.jpg')} >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'结束探索'} onPress={() => {
                            this.props.onClose();
                        }} />
                    </View>
                </View>
            </SafeAreaView>
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMainPopPage);
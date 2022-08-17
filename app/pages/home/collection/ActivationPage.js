import React from 'react';

import {
    View,
} from '../../../constants/native-ui';

import { 
    SafeAreaView,
    TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StarsBanner from './StarsBanner';

const ActivationPage = (props) => {

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 300, height: 400, backgroundColor: '#eee' }}>
                    <View style={{ width: '100%', alignItems: 'flex-end' }}>
                        <AntDesign name='close' size={30} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default ActivationPage;
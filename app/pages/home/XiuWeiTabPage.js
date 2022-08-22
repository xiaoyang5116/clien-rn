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
    Animated,
    DeviceEventEmitter,
    ScrollView, 
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCapInset from 'react-native-image-capinsets-next';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const ProgressBar = (props) => {

    const translateX = React.useRef(new Animated.Value(-200)).current;

    React.useEffect(() => {
    })

    return (
        <View style={{ width: '100%', backgroundColor: '#3f3e3a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#000', borderRadius: 3 }}>
            <Animated.View style={{ width: '100%', height: 35, backgroundColor: '#4d6daf', transform: [{ translateX: translateX }] }} />
            <View style={{ position: 'absolute' }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>16091/128650</Text>
            </View>
        </View>
    )
}

const XiuWeiTabPage = (props) => {

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '90%', marginTop: 10, borderRadius: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: '#677d8e', flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>生命： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>防御： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>法力： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>攻击： 1000</Text></View>
            </View>
            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <FastImage style={{ width: px2pd(607), height: px2pd(785) }} source={require('../../../assets/bg/xiuwei_bg.png')} />
                <View style={{ position: 'absolute' }}>
                    <TextButton title={'升级'} />
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, color: '#000' }}>返虚期.八重</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <View style={{ width: px2pd(800), height: 40 }}>
                    <ProgressBar />
                </View>
            </View>
            <View style={{ flexDirection: 'row' , marginTop: 10 }}>
                <Text style={{ fontSize: 22, color: '#000' }}>修为：</Text>
                <Text style={{ fontSize: 22, color: '#829358' }}>+600/分钟</Text>
            </View>
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

export default connect((state) => ({ ...state.AppModel }))(XiuWeiTabPage);
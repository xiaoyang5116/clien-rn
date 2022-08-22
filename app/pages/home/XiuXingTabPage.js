import React from 'react';

import {
    connect,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
} from '../../constants/native-ui';

import { 
    Animated, Easing,
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const PROGRESS_BAR_WIDTH = px2pd(800);
 
const ProgressBar = (props) => {

    const translateX = React.useRef(new Animated.Value(-PROGRESS_BAR_WIDTH)).current;

    React.useEffect(() => {
        let percent = props.value / props.limit;
        percent = (percent > 1) ? 1 : percent;
        const progressWidth = (1 - percent) * PROGRESS_BAR_WIDTH;

        Animated.timing(translateX, {
         toValue: -progressWidth,
         duration: 600,
         easing: Easing.cubic,
         useNativeDriver: true,   
        }).start();
    })

    return (
        <View style={{ width: '100%', backgroundColor: '#3f3e3a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#000', borderRadius: 3 }}>
            <Animated.View style={{ width: '100%', height: 35, backgroundColor: '#4d6daf', transform: [{ translateX: translateX }] }} />
            <View style={{ position: 'absolute' }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>{props.value} / {props.limit}</Text>
            </View>
        </View>
    )
}

const XiuXingTabPage = (props) => {

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '90%', marginTop: 10, borderRadius: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: '#677d8e', flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>生命： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>防御： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>法力： 1000</Text></View>
                <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>攻击： 1000</Text></View>
            </View>
            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                <FastImage style={{ width: px2pd(607), height: px2pd(785) }} source={require('../../../assets/bg/xiuxing_bg.png')} />
                <View style={{ position: 'absolute' }}>
                    <TextButton title={'升级'} disabled={true} />
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 24, color: '#000' }}>返虚期.八重</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <View style={{ width: PROGRESS_BAR_WIDTH, height: 40 }}>
                    <ProgressBar value={108650} limit={128650} />
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

export default connect((state) => ({ ...state.AppModel }))(XiuXingTabPage);
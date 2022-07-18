import {
    View,
    Text,
    Image,
    Animated,
    Easing,
    DeviceEventEmitter,
    Dimensions,
    StyleSheet
} from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../constants';

import RootView from '../RootView';


const { width } = Dimensions.get('window')

const BothSidesPushEffectComponent = (props) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const leftWidth = useRef(new Animated.Value(0)).current;
    const rightWidth = useRef(new Animated.Value(0)).current;

    const animEnd = () => {
        DeviceEventEmitter.emit(EventKeys.ANIMATION_END, true);
        props.onClose()
    }

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
                delay: 600,
                // easing: Easing.ease,
            }),
            Animated.timing(leftWidth, {
                toValue: -width,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(rightWidth, {
                toValue: width,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
        ]).start(animEnd)
    }, [])

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imgBox1, {
                transform: [{ translateX: leftWidth }],
                opacity: fadeAnim
            }]}>
                <Image style={styles.img} source={require("../../../assets/bg/lottery_bg.jpg")} />
            </Animated.View>
            <Animated.View style={[styles.imgBox2, {
                transform: [{ translateX: rightWidth }],
                opacity: fadeAnim
            }]}>
                <Image style={styles.img} source={require("../../../assets/bg/lottery_bg2.jpg")} />
            </Animated.View>
        </View>
    )
}


class BothSidesPushEffect {
    static show() {
        const key = RootView.add(
            <BothSidesPushEffectComponent onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default BothSidesPushEffect

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
    },
    imgBox1: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    imgBox2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
    },
    img: {
        width: "100%",
        height: "100%"
    }
})

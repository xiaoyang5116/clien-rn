import { View, Text, Image, Animated, Easing, DeviceEventEmitter } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../constants';

import RootView from '../RootView';
import BuXue from './BuXue'

const FlashBuXue = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const bgAnim = useRef(new Animated.Value(1)).current;

    const animEnd = () => {
        DeviceEventEmitter.emit(EventKeys.ANIMATION_END, true);
        props.onClose()
    }

    const closeAnim = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(bgAnim, {
                toValue: 0,
                duration: 400,
                delay: 800,
                useNativeDriver: false,
                easing: Easing.ease,
            })
        ]).start(animEnd)
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 0.8,
            duration: 1000,
            delay: 500,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start(closeAnim);
    }, [])

    return (
        <Animated.View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.2)', opacity: bgAnim }}>
            <Animated.Image
                resizeMode='stretch'
                style={{ width: '100%', height: '100%', opacity: fadeAnim, position: "absolute", top: 0, left: 0, zIndex: 1 }}
                source={props.img}
            />
            <BuXue />
        </Animated.View>
    )
}

class FlashBuXueModal {
    static show(img) {
        const key = RootView.add(
            <FlashBuXue img={img} onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default FlashBuXueModal
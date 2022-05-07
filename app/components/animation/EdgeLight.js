import { View, Text, Image, Animated, Easing, DeviceEventEmitter } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../constants';

import RootView from '../RootView';

const EdgeLight = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const animEnd = () => {
        DeviceEventEmitter.emit(EventKeys.ANIMATION_END, true);
        props.onClose()
    }

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 90,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 90,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
        ]).start(animEnd);
    }, [])
    return (
        <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}>
            <Animated.Image
                resizeMode='stretch'
                style={{ width: '100%', height: '100%', opacity: fadeAnim }}
                source={props.img}
            />
        </View>
    )
}

class EdgeLightModal {
    static show(img) {
        const key = RootView.add(
            <EdgeLight img={img} onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default EdgeLightModal
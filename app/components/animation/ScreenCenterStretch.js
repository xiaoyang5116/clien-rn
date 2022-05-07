import { View, Text, Image, Animated, Easing } from 'react-native'
import React, { useRef, useEffect } from 'react'

import RootView from '../RootView';


const ScreenCenterStretch = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const transformAnim = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 90,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }),
                Animated.timing(transformAnim, {
                    toValue: 0.4,
                    duration: 90,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }),
            ]),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 90,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
        ]).start(props.onClose);
    }, [])
    return (
        <View
            // pointerEvents="box-none"
            style={{
                flex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Animated.Image
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: transformAnim }, { rotate: '-10deg' }]

                }}
                source={props.img}
            />
        </View>
    )
}

class ScreenCenterStretchModal {
    static show(img) {
        const key = RootView.add(
            <ScreenCenterStretch img={img} onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}
export default ScreenCenterStretchModal
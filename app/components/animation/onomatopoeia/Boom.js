import {
    View,
    Text,
    Image,
    Animated,
    Easing,
    DeviceEventEmitter,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'

import { EventKeys, } from '../../../constants';
import { px2pd } from '../../../constants/resolution';

import RootView from '../../RootView';


const Boom = (props) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current

    const animationEnd = () => {
        DeviceEventEmitter.emit("boom", 1);
    }

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 50,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }),
                Animated.timing(translateY, {
                    toValue: -50,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.ease,
                }),
            ]),
            Animated.timing(opacity, {
                toValue: 0,
                delay: 300,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.ease,
            }),

        ]).start(animationEnd)
    }, [])

    return (
        <View style={styles.boom_container}>
            <Animated.View style={{
                marginRight: 12,
                opacity,
                transform: [
                    { translateX },
                    { translateY },
                    { scale }
                ],
            }}>
                {/* <Text style={{ fontSize: 20, }}>Boom</Text> */}
                <Image style={{ width: px2pd(353), height: px2pd(335) }} source={require('../../../../assets/animations/peng.png')} />
            </Animated.View>
        </View>
    )
}

const BoomContainer = (props) => {
    const DATA = ["1", "2"]
    const [currIndex, setCurrIndex] = useState(0)
    const animationCount = useRef(0)
    const animationEndListener = useRef(null)

    useEffect(() => {
        let closeTimer = null

        animationEndListener.current = DeviceEventEmitter.addListener("boom", (value) => {
            animationCount.current += value
            if (animationCount.current === DATA.length) {
                props.onClose()
                // closeTimer = setTimeout(() => {
                //     props.onClose()
                // }, 600)

            }
        });

        let timer = setTimeout(() => {
            setCurrIndex(1)
        }, 200)

        return () => {
            clearTimeout(timer,)
            clearTimeout(closeTimer)
            if (animationEndListener.current !== null) {
                animationEndListener.current.remove();
            }
        }
    }, [])

    console.log("props", props);
    return (
        <View style={[styles.container, { zIndex: 99 }]} pointerEvents="none">
            <View style={{
                position: "absolute",
                bottom: props.bottom ? props.bottom : "10%",
                left: props.left ? props.left : "10%",
                right: props.right ? props.right : null,
                top: props.top ? props.top : null,
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start"
            }}>
                {currIndex === 1 ? <Boom /> : <></>}
                <Boom />
            </View>
        </View>
    )
}

class BoomModel {
    static show(props) {
        const key = RootView.add(
            <BoomContainer {...props} onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default BoomModel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    boom_container: {
        // width: 100,
        // height: 100,
    }
})
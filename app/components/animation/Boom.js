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

import { EventKeys } from '../../constants';

import RootView from '../RootView';


const Boom = (props) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const animationEnd = () => {
        DeviceEventEmitter.emit("boom", 1);
    }

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 50,
                duration: 200,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(translateY, {
                toValue: -50,
                duration: 200,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
        ]).start(animationEnd)
    }, [])

    return (
        <View style={styles.boom_container}>
            <Animated.View style={{
                marginRight: 12,
                transform: [
                    { translateX },
                    { translateY },
                    { scale }
                ],
            }}>
                <Text style={{ fontSize: 20, }}>Boom</Text>
            </Animated.View>
        </View>
    )
}

const BoomContainer = (props) => {
    const DATA = ["1", "2"]
    const [currIndex, setCurrIndex] = useState(0)
    const animationCount = useRef(0)

    useEffect(() => {
        let closeTimer = null
    
        DeviceEventEmitter.addListener("boom", (value) => {
            animationCount.current += value
            if (animationCount.current === DATA.length) {
                closeTimer= setTimeout(()=>{
                    props.onClose()
                },500)

            }
        });
    
        let timer = setTimeout(() => {
            setCurrIndex(1)
        }, 200)
    
        return () => {
            clearTimeout(timer,closeTimer)
        }
    }, [])

    return (
        <View style={[styles.container, { zIndex: 99 }]} pointerEvents="none">
            <View style={{
                position: "absolute",
                bottom: "10%",
                left: "10%",
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
    static show(img) {
        const key = RootView.add(
            <BoomContainer img={img} onClose={() => {
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
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, TouchableOpacity, Easing, DeviceEventEmitter } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';


const AnimatedComponent = (props) => {

    const { currentStyles, message } = props

    // let dismissHandler = null

    const onEnd = () => {
        DeviceEventEmitter.emit("BottomToTopSmooth", 1)
    }

    const bottomAnim = useRef(new Animated.Value(50)).current
    const opacityAnim = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(                  // 随时间变化而执行动画
                    opacityAnim,                     // 动画中的变量值
                    {
                        toValue: 1,               // 透明度最终变为1，即完全不透明
                        duration: 100,            // 让动画持续一段时间
                        useNativeDriver: false,
                        easing: Easing.ease
                    }
                ),
                Animated.timing(
                    bottomAnim,
                    {
                        toValue: 100,
                        duration: 660,
                        useNativeDriver: false,
                        easing: Easing.linear
                    }
                ),
            ]),
            Animated.parallel([
                Animated.timing(                  // 随时间变化而执行动画
                    opacityAnim,                     // 动画中的变量值
                    {
                        toValue: 0,               // 透明度最终变为1，即完全不透明
                        duration: 350,            // 让动画持续一段时间
                        useNativeDriver: false,
                        easing: Easing.ease
                    }
                ),
                Animated.timing(
                    bottomAnim,
                    {
                        toValue: 130,
                        duration: 350,
                        useNativeDriver: false,
                        easing: Easing.linear
                    }
                ),
            ])
        ]).start(onEnd)

    }, [bottomAnim, opacityAnim])

    return (
        <Animated.View                 // 使用专门的可动画化的View组件
            style={{
                // ...currentStyles.tooltip,
                position: "absolute",
                width: "80%",
                bottom: bottomAnim,
                opacity: opacityAnim,
            }}
        >
            <TouchableOpacity onPress={props.onHide}>
                <View style={currentStyles.tooltipContainer}>
                    <View style={currentStyles.tooltipImg}></View>
                    <FastImage style={{ width: px2pd(1042), height: px2pd(84), position: 'absolute' }} source={require('../../../../assets/bg/toast.png')} />
                    <Text style={currentStyles.tooltipText}>
                        {message}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default BottomToTopSmooth = (props) => {
    const { currentStyles, time, message } = props
    const [index, setIndex] = useState(1)

    useEffect(() => {
        let timer = null
        if (Array.isArray(message)) {
            timer = setInterval(() => {
                if (index < message.length) {
                    setIndex((index) => index + 1)
                } else {
                    clearInterval(timer)
                }
            }, time)
        }

        let count = 0
        const listener = DeviceEventEmitter.addListener('BottomToTopSmooth', (num) => {
            count += num
            if (Array.isArray(message) && count > message.length - 1) {
                props.onHide()
            }
            if (!Array.isArray(message) && count === 1) {
                props.onHide()
            }
        })

        return () => {
            listener.remove();
            clearInterval(timer)
        }
    }, [])

    // if (Array.isArray(message)) {
    //     let num = 0
    //     let timer = setInterval(() => {
    //         if (num < message.length) {
    //             // setArr([...arr, <AnimatedComponent message={message[num]} currentStyles={currentStyles} />])
    //             arr.push(<AnimatedComponent message={message[num]} currentStyles={currentStyles} />)
    //             num++
    //         } else {
    //             clearInterval(timer)
    //         }
    //     }, 500)

    // } else {
    //     // setArr([<AnimatedComponent message={message} currentStyles={currentStyles} />])
    //     arr.push(<AnimatedComponent message={message} currentStyles={currentStyles} />)
    // }

    // return arr.map((item, index) => (
    //     <View key={index} pointerEvents="box-none" style={currentStyles.tooltipWrap}>

    //     </View>
    // ))

    if (Array.isArray(message)) {
        return (
            <View pointerEvents="box-none" style={currentStyles.tooltipWrap}>
                {
                    message.map((item, i) => {
                        if (i < index) {
                            return <AnimatedComponent key={i} message={item} currentStyles={currentStyles} />
                        }
                    })
                }
            </View>
        )
    }

    return (
        <View pointerEvents="box-none" style={currentStyles.tooltipWrap}>
            <AnimatedComponent message={message} currentStyles={currentStyles} />
        </View>
    )

}

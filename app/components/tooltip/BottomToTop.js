import React, { useRef, PureComponent, ReactDOM, useState } from 'react'
import { View, Text, ImageBackground, Image, Animated, TouchableOpacity } from 'react-native';


export default BottomToTop = (props) => {

    const { currentStyles, time, message } = props
    let dismissHandler = null

    // const bottomAnim = useRef(new Animated.Value(90)).current
    const opacityAnim = useRef(new Animated.Value(0)).current
    // React.useEffect(() => {
    //     Animated.parallel([
    //         Animated.timing(                  // 随时间变化而执行动画
    //             opacityAnim,                     // 动画中的变量值
    //             {
    //                 toValue: 1,               // 透明度最终变为1，即完全不透明
    //                 duration: time,            // 让动画持续一段时间
    //                 useNativeDriver: false,
    //             }
    //         ),
    //         Animated.timing(
    //             bottomAnim,
    //             {
    //                 toValue: 120,
    //                 duration: time,
    //                 useNativeDriver: false,
    //             }
    //         ),
    //     ]).start()

    // }, [opacityAnim, bottomAnim])
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(                  // 随时间变化而执行动画
                opacityAnim,                     // 动画中的变量值
                {
                    toValue: 1,               // 透明度最终变为1，即完全不透明
                    duration: 400,            // 让动画持续一段时间
                    useNativeDriver: false,
                }
            ),
        ]).start(timingDismiss)
        return () => {
            clearTimeout(this.dismissHandler)
        }

    }, [opacityAnim])
    const timingDismiss = () => {
        dismissHandler = setTimeout(() => {
            dismiss()
        }, time)
    };

    const dismiss = () => {
        Animated.timing(
            opacityAnim,
            {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            },
        ).start(props.onHide);
    };

    return (
        <Animated.View                 // 使用专门的可动画化的View组件
            style={{
                ...currentStyles.tooltip,
                width: "80%",
                // bottom: bottomAnim,
                opacity: opacityAnim,
                marginBottom: 15,
            }}
        >
            <TouchableOpacity onPress={props.onHide}>
                <View style={currentStyles.tooltipContainer}>
                    <View style={currentStyles.tooltipImg}></View>
                    <Text style={currentStyles.tooltipText}>
                        {message}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}


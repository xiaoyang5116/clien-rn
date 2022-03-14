import React, { useRef, PureComponent, ReactDOM, useState } from 'react'
import { View, Text, ImageBackground, Image, Animated, TouchableOpacity } from 'react-native';


export default BottomToTop = (props) => {
    const bottomAnim = useRef(new Animated.Value(90)).current
    const opacityAnim = useRef(new Animated.Value(0)).current
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
            Animated.timing(
                bottomAnim,
                {
                    toValue: 120,
                    duration: 400,
                    useNativeDriver: false,
                }
            ),
        ]).start()

    }, [opacityAnim, bottomAnim])

    return (
        <Animated.View                 // 使用专门的可动画化的View组件
            style={{
                ...props.style.tooltip,
                width: "80%",
                bottom: bottomAnim,
                opacity: opacityAnim,
            }}
        >
            <TouchableOpacity onPress={props.onHide}>
            {/* <TouchableOpacity> */}
                <View style={{ ...props.style.tooltipContainer, }}>
                    <View style={{ ...props.style.tooltipImg, }}></View>
                    <Text style={{
                        ...props.style.tooltipText
                    }}>{props.message}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}


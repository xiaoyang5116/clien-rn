import React, { useRef } from 'react'
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';
import { getWindowSize } from "../../../constants";


const size = getWindowSize().height;
const height = (size / 2) - 80

export default CenterToTop = (props) => {

    const { currentStyles, time, message } = props

    // let dismissHandler = null

    const bottomAnim = useRef(new Animated.Value(height)).current
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
                        toValue: (height + 50),
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
                        toValue: (height + 50 + 30),
                        duration: 350,
                        useNativeDriver: false,
                        easing: Easing.linear
                    }
                ),
            ])
        ]).start(props.onHide)

    }, [bottomAnim, opacityAnim])

    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                flexDirection: "row",
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Animated.View                 // 使用专门的可动画化的View组件
                style={{
                    ...currentStyles.tooltip,
                    position: "absolute",
                    width: "80%",
                    bottom: bottomAnim,
                    opacity: opacityAnim,
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
        </View>
    )
}


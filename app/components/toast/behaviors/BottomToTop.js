import React, { useRef } from 'react'
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';


export default BottomToTop = (props) => {

    const { currentStyles, time, message } = props

    let dismissHandler = null

    const bottomAnim = useRef(new Animated.Value(100)).current
    const opacityAnim = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(                  // 随时间变化而执行动画
                opacityAnim,                     // 动画中的变量值
                {
                    toValue: 1,               // 透明度最终变为1，即完全不透明
                    duration: 300,            // 让动画持续一段时间
                    useNativeDriver: false,
                }
            ),
            Animated.timing(
                bottomAnim,
                {
                    toValue: 120,
                    duration: 300,
                    useNativeDriver: false,
                }
            ),
        ]).start(timingDismiss)

        return () => {
            clearTimeout(this.dismissHandler)
        }

    }, [])
    const timingDismiss = () => {
        dismissHandler = setTimeout(() => {
            dismiss()
        }, time)
    };

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(                  // 随时间变化而执行动画
                opacityAnim,                     // 动画中的变量值
                {
                    toValue: 0,               // 透明度最终变为1，即完全不透明
                    duration: 300,            // 让动画持续一段时间
                    useNativeDriver: false,
                }
            ),
            Animated.timing(
                bottomAnim,
                {
                    toValue: 150,
                    duration: 300,
                    useNativeDriver: false,
                }
            ),
        ]).start(props.onHide)
    };

    return (
        <View pointerEvents="box-none" style={currentStyles.tooltipWrap}>
            <Animated.View                 // 使用专门的可动画化的View组件
                style={{
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
        </View>
    )
}


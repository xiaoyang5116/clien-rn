import React, { useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';

export default LeftToRight = props => {
  const { currentStyles, time, message } = props;

  let dismissHandler = null

  const leftAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
        leftAnim,
        {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }
      ),
    ]).start(timingDismiss)

    return () => {
      clearTimeout(this.dismissHandler)
    }

  }, [opacityAnim, leftAnim])

  const timingDismiss = () => {
    dismissHandler = setTimeout(() => {
      dismiss()
    }, time)
  };

  const dismiss = () => {
    Animated.timing(                  // 随时间变化而执行动画
      opacityAnim,                     // 动画中的变量值
      {
        toValue: 0,               // 透明度最终变为1，即完全不透明
        duration: 300,            // 让动画持续一段时间
        useNativeDriver: false,
      }
    ).start(props.onHide)
  };

  return (
    <Animated.View // 使用专门的可动画化的View组件
      style={{
        // ...currentStyles.tooltip,
        position: 'absolute',
        bottom: 100,
        left: leftAnim,
        opacity: opacityAnim,
      }}>
      <TouchableOpacity onPress={props.isHide}>
        <View style={currentStyles.tooltipContainer}>
          <View style={currentStyles.tooltipImg}></View>
          <FastImage style={{ width: px2pd(1042), height: px2pd(84), position: 'absolute' }} source={require('../../../../assets/bg/toast.png')} />
          <Text style={currentStyles.tooltipText}>
            {message}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

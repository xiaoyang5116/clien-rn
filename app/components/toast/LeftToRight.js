import React, { useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';

export default LeftToRight = props => {
  const { currentStyles, time, message } = props;

  const leftAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
            leftAnim,
              {
                  toValue: 70,
                  duration: 860,
                  useNativeDriver: false,
                  easing: Easing.linear
              }
          ),
      ]),
      Animated.parallel([
        Animated.timing(                  // 随时间变化而执行动画
            opacityAnim,                     // 动画中的变量值
            {
                toValue: 0,               // 透明度最终变为0，即完全不透明
                duration: 350,            // 让动画持续一段时间
                useNativeDriver: false,
                easing: Easing.ease
            }
        ),
        Animated.timing(
          leftAnim,
            {
                toValue: 100,
                duration: 350,
                useNativeDriver: false,
                easing: Easing.linear
            }
        ),
    ]),
  ]).start(props.onHide)
  }, [opacityAnim, leftAnim]);

  return (
    <Animated.View // 使用专门的可动画化的View组件
      style={{
        ...currentStyles.tooltip,
        position: 'absolute',
        bottom: 100,
        left: leftAnim,
        opacity: opacityAnim,
      }}>
      <TouchableOpacity onPress={props.isHide}>
        <View style={currentStyles.tooltipContainer}>
          <View style={currentStyles.tooltipImg}></View>
          <Text style={currentStyles.tooltipText}>
            {message}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

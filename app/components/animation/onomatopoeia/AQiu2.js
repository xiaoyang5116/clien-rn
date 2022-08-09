import { View, Text, Image, Animated, Easing, DeviceEventEmitter } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../../constants';

import RootView from '../../RootView';


const AQiu2 = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(1)).current;
  const valueX = useRef(new Animated.Value(0)).current
  const valueY = useRef(new Animated.Value(0)).current

  const animEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start(props.onClose)
  }

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
    ]).start(slightShock);
  }, [])

  // 随机震动
  let index = 0
  slightShock = () => {
    if (index > 4) return animEnd()
    let X = Math.floor(Math.random() * 10 + 10);
    let Y = Math.floor(Math.random() * 10 + 10);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(valueX, { toValue: X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(valueY, { toValue: Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(valueX, { toValue: -X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(valueY, { toValue: -Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(slightShock)

    index++
  }

  return (
    <View
      pointerEvents='none'
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
          marginTop: -200,
          opacity: fadeAnim,
          transform: [
            { scale: transformAnim },
            { translateX: valueX },
            { translateY: valueY },
            { rotate: '-15deg' }
          ]
        }}
        source={require('../../../../assets/animations/onomatopoeia/aQiu.png')}
      />
    </View>
  )
}

class AQiu2Modal {
  static show(img) {
    const key = RootView.add(
      <AQiu2 onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}
export default AQiu2Modal
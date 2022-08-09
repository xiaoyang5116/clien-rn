import { View, Text, Image, Animated, Easing, DeviceEventEmitter } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../../constants';

import RootView from '../../RootView';


const KuangDang = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(15)).current

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
        Animated.timing(scale, {
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
    let r = Math.floor(Math.random() * 10 + 1);
    // rotate.setValue(r)
    // console.log("r", rotate);
    Animated.sequence([
      Animated.timing(rotate, { toValue: r, duration: 20, useNativeDriver: false, easing: Easing.linear }),
      Animated.timing(rotate, { toValue: -r, duration: 20, useNativeDriver: false, easing: Easing.linear }),
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
            { scale },
            {
              rotate: rotate.interpolate({
                inputRange: [-10, 10],
                outputRange: ['-10deg', '10deg']
              })
            }
          ]
        }}
        source={require('../../../../assets/animations/onomatopoeia/kuangdang.png')}
      />
    </View>
  )
}

class KuangDangModal {
  static show() {
    const key = RootView.add(
      <KuangDang onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}
export default KuangDangModal
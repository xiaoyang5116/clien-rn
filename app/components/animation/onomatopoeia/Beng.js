import {
  View,
  Text,
  Image,
  ImageBackground,
  Animated,
  Easing,
  DeviceEventEmitter,
  StyleSheet
} from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../../constants';

import RootView from '../../RootView';
import { px2pd } from '../../../constants/resolution';

const Beng = (props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX2 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(slightShock)
  }, [])

  // 随机震动
  let index = 0
  slightShock = () => {
    if (index > 4) return animationEnd()

    let X = Math.floor(Math.random() * 10 + 5);
    let Y = Math.floor(Math.random() * 10 + 5);
    let X2 = Math.floor(Math.random() * 10 + 1);
    let Y2 = Math.floor(Math.random() * 10 + 1);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, { toValue: X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateX2, { toValue: X2, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY2, { toValue: Y2, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(translateX, { toValue: -X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: -Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateX2, { toValue: -X2, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY2, { toValue: -Y2, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(slightShock)

    index++
  }

  const animationEnd = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateX2, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY2, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 500, delay: 200, useNativeDriver: false, easing: Easing.ease }),
    ]).start(props.onClose)
  }

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.View style={{
        opacity,
        justifyContent: "center",
        alignItems: 'center',
        transform: [
          { scale },
        ]
      }}>
        <Animated.Image style={{
          position: "absolute",
          width: px2pd(724),
          height: px2pd(514),
          transform: [
            { translateX },
            { translateY },
          ]
        }}
          source={require('../../../../assets/animations/onomatopoeia/beng_bg.png')}
        />
        <Animated.Image
          style={{
            width: px2pd(332),
            height: px2pd(213),
            transform: [
              { translateX: translateX2 },
              { translateY: translateY2 },
            ]
          }}
          source={require('../../../../assets/animations/onomatopoeia/beng.png')}
        />

      </Animated.View>
    </View>
  )
}

class BengModal {
  static show() {
    const key = RootView.add(
      <Beng onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default BengModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
})
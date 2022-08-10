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
        duration: 50,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(slightShock)
  }, [])

  // 随机震动
  let index = 0
  slightShock = () => {
    if (index > 4) return animationEnd()

    let X = Math.floor(Math.random() * 10 + 30);
    let Y = Math.floor(Math.random() * 10 + 30);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, { toValue: X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(translateX, { toValue: -X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: -Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(slightShock)

    index++
  }

  const animationEnd = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: 0, duration: 70, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 200, delay: 500, useNativeDriver: false, easing: Easing.ease }),
    ]).start(props.onClose)
  }

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.View style={{
        opacity,
        transform: [
          { scale, },
          { translateX },
          { translateY },
        ]
      }}>
        <ImageBackground style={{
          width: px2pd(724),
          height: px2pd(514),
          justifyContent: "center",
          alignItems: 'center',
        }}
          source={require('../../../../assets/animations/onomatopoeia/beng_bg.png')}
        >
          <Image style={{ width: px2pd(332), height: px2pd(213) }} source={require('../../../../assets/animations/onomatopoeia/beng.png')} />
        </ImageBackground>

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
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Animated,
  Easing,
  DeviceEventEmitter,
  StyleSheet,
  Dimensions
} from 'react-native'
import React, { useRef, useEffect } from 'react'

import RootView from '../../RootView';
import { px2pd } from '../../../constants/resolution';


const HouHouHou = (props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 50,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start(slightShock)
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
      Animated.timing(opacity, { toValue: 0, duration: 200, delay: 100, useNativeDriver: false, easing: Easing.ease }),
    ]).start(props.onClose)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, {
        opacity,
        transform: [
          { translateX },
          { translateY }
        ]
      }]}>
        <Image style={styles.img} source={require('../../../../assets/animations/onomatopoeia/hou.png')} />
        <Image style={styles.img} source={require('../../../../assets/animations/onomatopoeia/hou.png')} />
        <Image style={styles.img} source={require('../../../../assets/animations/onomatopoeia/hou.png')} />
      </Animated.View>
    </View>
  )
}

class HouHouHouModal {
  static show() {
    const key = RootView.add(
      <HouHouHou onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default HouHouHouModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    alignItems: "center",
    justifyContent: 'center'
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: px2pd(291),
    height: px2pd(232),
  }
})
import { View, Text, Image, Animated, Easing, DeviceEventEmitter, StyleSheet } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../../constants';

import RootView from '../../RootView';
import { px2pd } from '../../../constants/resolution';

const DaGe = (props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(slightShock)
  }, [])

  // 随机震动
  let index = 0
  slightShock = () => {
    if (index > 4) {
      return Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start(props.onClose)
    }

    let X = Math.floor(Math.random() * 10 + 1);
    let Y = Math.floor(Math.random() * 10 + 1);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, { toValue: X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(translateX, { toValue: -X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(translateY, { toValue: -Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(slightShock)

    index++
  }

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.Image style={{
        width: px2pd(443),
        height: px2pd(243),
        opacity,
        transform: [
          { scale, },
          { translateX },
          { translateY },
        ]
      }}
        source={require('../../../../assets/animations/onomatopoeia/dage.png')}
      />
    </View>
  )
}

class DaGeModal {
  static show() {
    const key = RootView.add(
      <DaGe onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default DaGeModal

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
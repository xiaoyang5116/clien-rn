import { View, Text, Image, Animated, Easing, DeviceEventEmitter, StyleSheet } from 'react-native'
import React, { useRef, useEffect } from 'react'

import { EventKeys } from '../../../constants';

import RootView from '../../RootView';
import { px2pd } from '../../../constants/resolution';

const GaZhi = (props) => {
  // const []
  const opacity1 = useRef(new Animated.Value(0)).current
  const opacity2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity1, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity2, {
        toValue: 1,
        duration: 200,
        delay: 350,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.parallel([
        Animated.timing(opacity1, {
          toValue: 0,
          duration: 200,
          delay: 500,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 200,
          delay: 500,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ])
    ]).start(props.onClose)
  }, [])

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.Image style={{ width: px2pd(345), height: px2pd(313), opacity: opacity1 }} source={require('../../../../assets/animations/onomatopoeia/ga.png')} />
      <Animated.Image style={{ width: px2pd(333), height: px2pd(292), opacity: opacity2 }} source={require('../../../../assets/animations/onomatopoeia/zhi.png')} />
    </View>
  )
}

class GaZhiModal {
  static show() {
    const key = RootView.add(
      <GaZhi onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default GaZhiModal

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
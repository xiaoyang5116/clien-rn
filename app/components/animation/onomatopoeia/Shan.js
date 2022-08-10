import {
  View,
  SafeAreaView,
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

const Shan = (props) => {
  const opacity1 = useRef(new Animated.Value(0)).current
  const opacity2 = useRef(new Animated.Value(0)).current
  const opacity3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity1, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity1, {
        toValue: 0,
        duration: 50,
        delay: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity2, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity2, {
        toValue: 0,
        duration: 50,
        delay: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity3, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.timing(opacity3, {
        toValue: 0,
        duration: 50,
        delay: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(props.onClose)
  }, [])

  return (
    <View style={styles.container} pointerEvents="none">
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.Image style={[styles.img, { top: "30%", left: "50%", opacity: opacity1 }]} source={require('../../../../assets/animations/onomatopoeia/shan.png')} />
        <Animated.Image style={[styles.img, { top: "50%", left: "10%", opacity: opacity2 }]} source={require('../../../../assets/animations/onomatopoeia/shan.png')} />
        <Animated.Image style={[styles.img, { top: "70%", left: "70%", opacity: opacity3 }]} source={require('../../../../assets/animations/onomatopoeia/shan.png')} />
      </SafeAreaView>
    </View>
  )
}

class ShanModal {
  static show() {
    const key = RootView.add(
      <Shan onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default ShanModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  img: {
    width: px2pd(199),
    height: px2pd(243),
    position: "absolute",
  }
})
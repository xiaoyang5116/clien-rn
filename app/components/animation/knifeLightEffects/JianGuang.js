import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Easing,
  DeviceEventEmitter,
} from 'react-native'
import React, { useEffect, useRef } from 'react'

import { EventKeys } from '../../../constants';
import { px2pd } from '../../../constants/resolution';

import RootView from '../../RootView';


const JianGuang = (props) => {

  const { source, onClose } = props
  if (!source) return null

  const fadeAnim = useRef(new Animated.Value(1)).current

  const animEnd = () => {
    DeviceEventEmitter.emit(EventKeys.ANIMATION_END, true);
    onClose()
  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        delay: 2000,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(animEnd)
  }, [])

  return (
    <View style={[styles.container, { zIndex: 99 }]} pointerEvents="none">
      <Animated.View style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        opacity: fadeAnim,
        backgroundColor: "rgba(0,0,0,5)"
      }}>
        {/* 960 × 960 */}
        {/* <Image source={source} style={{ width: px2pd(960), height: px2pd(960) }} /> */}
        <Animated.Image source={source} style={{
          width: "100%",
          height: "100%",
        }} />
      </Animated.View>
    </View>
  )
}

class JianGuangModel {
  static show(props) {
    const key = RootView.add(
      <JianGuang {...props} onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default JianGuangModel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

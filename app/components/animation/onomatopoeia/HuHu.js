import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  StyleSheet,
  FlatList,
  interpolate
} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'

import { EventKeys, } from '../../../constants';
import { px2pd } from '../../../constants/resolution';

import RootView from '../../RootView';


const HuHu = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const valueX = useRef(new Animated.Value(0)).current
  const valueY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(valueX, {
          toValue: 70,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(valueY, {
          toValue: -70,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]),
      Animated.parallel([
        Animated.timing(valueX, {
          toValue: 140,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(valueY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(valueX, {
          toValue: 210,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(valueY, {
          toValue: -70,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ]),
    ]).start(props.onClose)
  }, [])

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.Image
        style={{
          opacity: fadeAnim,
          width: px2pd(700),
          height: px2pd(255),
          transform: [{ translateX: valueX }, { translateY: valueY }]
        }}
        source={require('../../../../assets/animations/onomatopoeia/huhu.png')}
      />
    </View>
  )

}

class HuHuModel {
  static show(props) {
    const key = RootView.add(
      <HuHu {...props} onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default HuHuModel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    justifyContent: 'center',
    // alignItems: 'center'
  },
})
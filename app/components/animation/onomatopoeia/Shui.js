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


const windowWidth = Dimensions.get('window').width;
const leftWidth = ((windowWidth - px2pd(839)) / 2) + px2pd(839)

const Shui = (props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(translateY, {
          toValue: -200,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(translateX, {
          toValue: -leftWidth,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        delay: 800,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(props.onClose)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Animated.Image
          style={{
            width: px2pd(839),
            height: px2pd(281),
            opacity,
            transform: [
              { scale },
              { translateY },
              { translateX },
            ]
          }}
          source={require('../../../../assets/animations/onomatopoeia/shui.png')}
        />
      </View>
    </View>
  )
}

class ShuiModal {
  static show() {
    const key = RootView.add(
      <Shui onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default ShuiModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    alignItems: "center"
  },
  box: {
    position: 'absolute',
    top: "60%",
    left: windowWidth
  }
})
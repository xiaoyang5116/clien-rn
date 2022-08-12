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
const leftWidth = (windowWidth - px2pd(701)) / 2

const PuChi = (props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0)).current
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(translateX, {
          toValue: leftWidth,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        delay: 400,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(props.onClose)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          width: px2pd(701),
          height: px2pd(267),
          opacity,
          transform: [
            { translateX },
            { scale }
          ]
        }}
        source={require('../../../../assets/animations/onomatopoeia/puchi.png')}
      />
    </View>
  )
}

class PuChiModal {
  static show() {
    const key = RootView.add(
      <PuChi onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default PuChiModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    justifyContent: "center",
    alignItems: "flex-start"
  },
})
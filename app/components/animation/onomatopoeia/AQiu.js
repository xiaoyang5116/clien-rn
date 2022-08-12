import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  FlatList
} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'

import { EventKeys, } from '../../../constants';
import { px2pd } from '../../../constants/resolution';

import RootView from '../../RootView';


const AQiu = (props) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current

  const animationEnd = () => {
    DeviceEventEmitter.emit("AQiu", 1);
  }

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        delay: 300,
        duration: 700,
        useNativeDriver: false,
        easing: Easing.ease,
      }),

    ]).start(animationEnd)
  }, [])

  return (
    <View style={styles.boom_container}>
      <Animated.View style={{
        marginRight: 12,
        opacity,
        transform: [
          { translateX },
          { translateY },
          { scale }
        ],
      }}>
        <Image style={{ width: px2pd(props.width), height: px2pd(props.height) }}
          source={props.source}
        />
      </Animated.View>
    </View>
  )
}

const AQiuContainer = (props) => {
  const DATA = ["1", "2"]
  const [currIndex, setCurrIndex] = useState(0)
  const animationCount = useRef(0)
  const animationEndListener = useRef(null)

  const valueX = useRef(new Animated.Value(0)).current
  const valueY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let closeTimer = null

    animationEndListener.current = DeviceEventEmitter.addListener("AQiu", (value) => {
      animationCount.current += value
      if (animationCount.current === DATA.length) {
        props.onClose()
      }
    });

    let timer = setTimeout(() => {
      // setCurrIndex(1)
      slightShock()
    }, 200)

    return () => {
      clearTimeout(timer,)
      clearTimeout(closeTimer)
      if (animationEndListener.current !== null) {
        animationEndListener.current.remove();
      }
    }
  }, [])

  // 随机震动
  let index = 0
  slightShock = () => {
    if (index > 1) return
    let X = Math.floor(Math.random() * 10 + 10);
    let Y = Math.floor(Math.random() * 10 + 10);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(valueX, { toValue: X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(valueY, { toValue: Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(valueX, { toValue: -X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(valueY, { toValue: -Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(valueX, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(valueY, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(slightShock)

    index++
  }

  return (
    <View style={[styles.container, { zIndex: 99 }]} pointerEvents="none">
      <Animated.View style={{
        position: "absolute",
        bottom: props.bottom ? props.bottom : "40%",
        left: props.left ? props.left : "10%",
        right: props.right ? props.right : null,
        top: props.top ? props.top : null,
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        transform: [{ translateX: valueX }, { translateY: valueY }]
      }}>
        {/* {currIndex === 1 ? <AQiu source={require('../../../../assets/animations/onomatopoeia/a.png')} width={305} height={230} /> : <></>} */}
        <AQiu source={require('../../../../assets/animations/onomatopoeia/a.png')} width={305} height={230} />
        <AQiu source={require('../../../../assets/animations/onomatopoeia/qiu.png')} width={274} height={223} />
      </Animated.View>
    </View>
  )
}

class AQiuModel {
  static show(props) {
    const key = RootView.add(
      <AQiuContainer {...props} onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default AQiuModel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  boom_container: {
    // width: 100,
    // height: 100,
  }
})
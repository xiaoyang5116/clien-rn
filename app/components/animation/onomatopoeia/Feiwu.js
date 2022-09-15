import { View, Text, Image, Animated, Easing, DeviceEventEmitter, StyleSheet } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'

import { EventKeys } from '../../../constants';
import RootView from '../../RootView';
import { px2pd } from '../../../constants/resolution';

const DATA = [
  { id: 1, img: require('../../../../assets/animations/onomatopoeia/fei.png'), style: { width: px2pd(256), height: px2pd(255) } },
  { id: 2, img: require('../../../../assets/animations/onomatopoeia/wu.png'), style: { width: px2pd(282), height: px2pd(255) } },
  { id: 3, img: require('../../../../assets/animations/onomatopoeia/feiwu_gantanhao.png'), style: { width: px2pd(107), height: px2pd(230) } },
]

const AnimatedComponent = ({ item }) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(3)).current;

  const animEnd = () => {
    DeviceEventEmitter.emit("FWIWU", 1);
  }

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 30,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
        Animated.timing(transformAnim, {
          toValue: 0.9,
          duration: 30,
          useNativeDriver: false,
          easing: Easing.ease,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
    ]).start(animEnd);
  }, [])

  return <Animated.Image style={{
    ...item.style, opacity: fadeAnim,
    transform: [{ scale: transformAnim },]
  }} source={item.img} />
}

const Feiwu = (props) => {

  const [dataIndex, setDataIndex] = useState(0)
  const animationEndListener = useRef(null)
  const animationCount = useRef(0)
  const shockCount = useRef(0)
  const valueX = useRef(new Animated.Value(0)).current
  const valueY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let timer = setInterval(() => {
      if (dataIndex < DATA.length - 1) {
        setDataIndex((dataIndex) => dataIndex + 1)
      } else {
        clearInterval(timer)
      }
    }, 500)

    animationEndListener.current = DeviceEventEmitter.addListener("FWIWU", (value) => {
      animationCount.current += value
      if (animationCount.current === DATA.length) {
        slightShock()
      }
    });

    return () => {
      clearInterval(timer)
      if (animationEndListener.current !== null) {
        animationEndListener.current.remove();
      }
    }
  }, [])

  const animEnd = () => {
    props.onClose()
  }

  // 随机震动
  slightShock = () => {
    if (shockCount.current > 4) return animEnd()
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
    ]).start(slightShock)

    shockCount.current += 1
  }

  return (
    <View pointerEvents='none' style={styles.container}>
      <Animated.View style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          { translateX: valueX },
          { translateY: valueY },
          { rotate: '-5deg' }
        ]
      }}>
        {
          DATA.map((item, index) => {
            if (index <= dataIndex) {
              return <AnimatedComponent key={index} item={item} />
            }
          })
        }
      </Animated.View>
    </View>
  )
}


class FeiwuModal {
  static show() {
    const key = RootView.add(
      <Feiwu onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default FeiwuModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    // flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
})
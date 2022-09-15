import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';

const viewWidth = px2pd(500);
const progressWidth = 60

const TheArrow = ({ changeValue }) => {
  if (Math.abs(Number(changeValue)) >= 5) {
    return Number(changeValue) > 0
      ? <FastImage style={styles.bigTheArrow} source={require('../../../../assets/linshi/big_red_theArrow.png')} />
      : <FastImage style={styles.bigTheArrow} source={require('../../../../assets/linshi/big_blue_theArrow.png')} />
  }

  return Number(changeValue) > 0
    ? <FastImage style={styles.theArrow} source={require('../../../../assets/linshi/red_Top_theArrow.png')} />
    : <FastImage style={styles.theArrow} source={require('../../../../assets/linshi/blue_bottom_theArrow.png')} />
}

const changeValueFormat = (changeValue) => {
  // return Number(changeValue) > 0 ? `+${changeValue}` : `${changeValue}`
  return Number(changeValue) > 0
    ? <Text style={{ fontSize: 14, color: "#CF0303" }}>{`+${changeValue}`}</Text>
    : <Text style={{ fontSize: 14, color: "#1B7DCB" }}>{`${changeValue}`}</Text>
}

const GoodAndEvil = ({ msg }) => {
  const maxValue = 100
  const translateX = (50 / maxValue) * msg.value

  return (
    <View style={styles.box}>
      <FastImage
        source={require('../../../../assets/linshi/attributeBg.png')}
        style={{ position: "absolute", width: px2pd(498), height: px2pd(98) }}
      />
      <Text style={styles.title}>{msg.key}</Text>
      <View style={{ height: 20, width: progressWidth, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: progressWidth, backgroundColor: "#fff", height: 5, position: "absolute" }}></View>
        <View style={{ width: 1, height: 10, backgroundColor: "#fff", transform: [{ translateX: -translateX }] }}></View>
      </View>
      <Text style={styles.title}>冷漠</Text>

      <Text style={styles.title}>{changeValueFormat(msg.changeValue)}</Text>
      <TheArrow changeValue={msg.changeValue} />
    </View>
  )
}

const LeftToRightSwiper = props => {
  const { animationEndEvent, children } = props;

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(-viewWidth)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 2000,
        delay: 3000,
        useNativeDriver: false,
      }),
    ]).start(onHide);
  }, []);

  const onHide = () => {
    animationEndEvent()
  }

  return (
    <Animated.View
      style={{
        marginTop: 12,
        transform: [{ translateX: translateXAnim }],
        width: viewWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: opacityAnim,
      }}>
      {children}
    </Animated.View>
  );
};


const AttrToast = (props) => {
  const { msg, closeToast, } = props;

  if (msg.key === "善良") {
    return (
      <LeftToRightSwiper animationEndEvent={() => { closeToast(1) }}>
        <GoodAndEvil msg={msg} />
      </LeftToRightSwiper>
    )
  }

  return (
    <LeftToRightSwiper animationEndEvent={() => { closeToast(1) }}>
      <View style={styles.box}>
        <FastImage
          source={require('../../../../assets/linshi/attributeBg.png')}
          style={{ position: "absolute", width: px2pd(498), height: px2pd(98) }}
        />
        <Text style={styles.title}>{msg.key}</Text>
        <View style={{ height: 20, width: progressWidth }} />
        <Text style={styles.title}>{msg.value}</Text>

        <Text style={styles.title}>{changeValueFormat(msg.changeValue)}</Text>
        <TheArrow changeValue={msg.changeValue} />
      </View>
    </LeftToRightSwiper>
  )
}

export default AttrToast;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: px2pd(498),
    height: px2pd(98),
    paddingLeft: 8,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    color: '#000',
  },
  changeValue: {
    fontSize: 18,
    color: '#B60000',
  },
  theArrow: {
    width: px2pd(46),
    height: px2pd(64)
  },
  bigTheArrow: {
    width: px2pd(65),
    height: px2pd(64)
  }
});

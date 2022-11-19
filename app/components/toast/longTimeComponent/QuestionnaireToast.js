import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';

const viewWidth = px2pd(399);

const changeValueFormat = (changeValue) => {
  return Number(changeValue) > 0
    ? <Text style={{ fontSize: 14, color: "#F97C7D" }}>{`+${changeValue}`}</Text>
    : <Text style={{ fontSize: 14, color: "#1B7DCB" }}>{`${changeValue}`}</Text>
}

const LeftToRightSwiper = props => {
  const { animationEndEvent, children, index } = props;

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
        marginTop: index === 0 ? "25%" : 30,
        marginLeft: 0,
        transform: [{ translateX: translateXAnim }],
        width: viewWidth,
        opacity: opacityAnim,
      }}
      pointerEvents="none"
      onTouchStart={()=>{console.log("bbbbb====");}}
      >
      {children}
    </Animated.View>
  );
};


const QuestionnaireToast = (props) => {
  const { msg, closeToast, index } = props;

  return (
    <LeftToRightSwiper animationEndEvent={() => { closeToast(1) }} index={index}>
      <View style={styles.box} onTouchStart={()=>{console.log("cccc====");}}>
        <FastImage
          source={require('../../../../assets/questionnaire/block_bg_3.png')}
          style={{ position: "absolute", width: px2pd(399), height: px2pd(70) }}
        />
        <Text style={styles.title}>{msg.key}</Text>
        <Text style={[styles.title, { marginLeft: 12 }]}>{changeValueFormat(msg.changeValue)}</Text>
      </View>
    </LeftToRightSwiper>
  )
}

export default QuestionnaireToast;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    width: px2pd(399),
    height: px2pd(70),
    paddingLeft: 8,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    color: '#fff',
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

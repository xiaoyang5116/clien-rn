import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { isPad, px2pd } from '../../../constants/resolution';

import TextAnimation from '../../textAnimation';
// import Clues from '../../cluesList';
import Achievement from '../../achievement';
import FastImage from 'react-native-fast-image';


const viewWidth = Dimensions.get('window').width;

const LeftToRightSwiper = props => {
  const { animationEndEvent, children, maoPaoFlashing } = props;

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(-viewWidth)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
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
      ]).start(maoPaoFlashing);
    }, 400);

    return () => {
      clearTimeout(timer)
    }
  }, []);

  return (
    <Animated.View
      style={{
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

const ContentComponent = (props) => {
  const { content, showEnd } = props
  const [contentIndex, setContentIndex] = useState(0)

  useEffect(() => {
    let timer = setInterval(() => {
      if (contentIndex < content.length - 1) {
        setContentIndex((contentIndex) => contentIndex + 1)
      } else {
        clearInterval(timer)
        showEnd()
      }
    }, 1000);

    return () => {
      clearInterval(timer)
    }
  }, [contentIndex])

  const renderItem = content.map((item, index) => {
    if (index <= contentIndex && index > contentIndex - 3) {
      if (index < contentIndex - 1) {
        return (
          <TextAnimation
            key={index}
            fontSize={18}
            type={'TextFadeIn'}
            style={{ color: '#fff', opacity: 0.5, ...styles.textStyle }}>
            {item}
          </TextAnimation>
        )
      }
      return <TextAnimation
        key={index}
        fontSize={18}
        type={'TextFadeIn'}
        style={{ color: '#fff', opacity: 1, ...styles.textStyle, }}>
        {item}
      </TextAnimation>
    }
  })

  return (
    <TouchableWithoutFeedback onPress={() => { Achievement.show() }}>
      <View style={{
        height: 90,
        justifyContent: "flex-end",
        marginLeft: isPad() ? 30 : 20,
        overflow: 'hidden',
      }}>
        {renderItem}
      </View>
    </TouchableWithoutFeedback>
  )
}

const AchievementToast = (props) => {
  const { msg, closeToast, index } = props;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const bgOpacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const showEnd = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 1000,
      delay: 100,
      useNativeDriver: false,
    }).start(() => closeToast(1))
  }

  const maoPaoFlashing = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    Animated.timing(bgOpacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [])

  return (
    <Animated.View style={{
      opacity: opacityAnim,
      marginTop: index === 0
        ? isPad() ? 0 : "25%"
        : 30,
    }}>
      <Animated.Image
        style={{
          position: 'absolute',
          width: px2pd(1080),
          height: px2pd(404),
          opacity: bgOpacityAnim,
        }}
        source={require('../../../../assets/clues/clues_bg_1.png')}
      />
      <LeftToRightSwiper maoPaoFlashing={maoPaoFlashing}>
        <FastImage
          style={{ width: px2pd(1080), height: px2pd(200), position: 'absolute' }}
          source={require('../../../../assets/clues/clues_bg_2.png')}
        />
        <Animated.Image
          style={{
            width: px2pd(180), height: px2pd(62), position: 'absolute',
            marginLeft: isPad() ? 23 : 6,
            transform: [{ scale: scaleAnim }]
          }}
          source={require('../../../../assets/clues/maopao.png')}
        />
        <View style={{
          width: px2pd(1080),
          height: px2pd(312),
          flexDirection: 'row',
          justifyContent: "flex-start",
          alignItems: 'flex-end',
          alignContent: 'center',
          alignSelf: "center",
          paddingBottom: isPad() ? 50 : 22,
        }}>
          <Text style={{ fontSize: 14, color: "#fff", marginLeft: isPad() ? 40 : 23, height: 20 }}>解锁新成就</Text>
          <ContentComponent content={msg.content} showEnd={showEnd} />
        </View>
      </LeftToRightSwiper>
    </Animated.View>
  )
}

export default AchievementToast

const styles = StyleSheet.create({
  textStyle: {
    textShadowColor: '#000',
    textShadowRadius: 3,
    shadowOpacity: 0,
  }
})
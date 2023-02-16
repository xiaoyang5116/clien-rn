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
        // justifyContent: 'space-between',
        // justifyContent: 'center',
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
    // Animated.timing(opacityAnim, {
    //   toValue: 0,
    //   duration: 30000,
    //   delay: 100,
    //   useNativeDriver: false,
    // }).start(() => closeToast(1))
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
      <LeftToRightSwiper maoPaoFlashing={maoPaoFlashing}>
        <FastImage
          style={{ width: px2pd(1080), height: px2pd(376), position: 'absolute' }}
          source={require('../../../../assets/achievement/toast_bg.png')}
        />
        <Animated.Image
          style={{
            width: px2pd(166), height: px2pd(196), position: 'absolute',
            top: 0,
            left: px2pd(40),
            marginLeft: isPad() ? 23 : 6,
            transform: [{ scale: scaleAnim }]
          }}
          source={require('../../../../assets/achievement/1.png')}
        />
        <Animated.Image
          style={{
            width: px2pd(204), height: px2pd(48), position: 'absolute',
            top: px2pd(150),
            left: px2pd(40),
            // marginLeft: isPad() ? 23 : 6,
            transform: [{ scale: scaleAnim }]
          }}
          source={require('../../../../assets/achievement/unlock.png')}
        />

        <View style={{
          width: px2pd(1080),
          height: px2pd(300),
        }}>
          <View style={{
            position: "absolute",
            left: px2pd(300),
            top: px2pd(-90)
            // paddingBottom: isPad() ? 50 : 22,
          }}>
            <ContentComponent content={msg.content} showEnd={showEnd} />
          </View>
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
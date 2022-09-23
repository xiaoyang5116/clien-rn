import { StyleSheet, Text, View, Animated, FlatList, TouchableWithoutFeedback, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { px2pd } from '../../../constants/resolution';

import TextAnimation from '../../textAnimation';
import Clues from '../../cluesList';
import FastImage from 'react-native-fast-image';


const viewWidth = Dimensions.get('window').width;
const LeftToRightSwiper = props => {
  const { animationEndEvent, children, opacityAnim } = props;

  // const opacityAnim = useRef(new Animated.Value(0)).current;
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
    ]).start();
  }, []);

  // const onHide = () => {
  //   animationEndEvent()
  // }

  return (
    <Animated.View
      style={{
        marginTop: "25%",
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
    <TouchableWithoutFeedback onPress={() => { Clues.show() }}>
      <View style={{
        height: 90,
        justifyContent: "flex-end",
        marginLeft: 20,
        overflow: 'hidden',
      }}>
        {renderItem}
      </View>
    </TouchableWithoutFeedback>
  )
}

const CluesToast = (props) => {
  const { msg, closeToast, } = props;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // {"cluesType": "线索", "content": ["REDER线索1", "上飞机啊佛", "分开是佛阿含经分开久了"], "title": "线索4", "type": "clues"}

  const showEnd = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 2000,
      delay: 3000,
      useNativeDriver: false,
    }).start(() => closeToast(1))
  }

  return (
    <LeftToRightSwiper opacityAnim={opacityAnim}>
      <FastImage
        style={{ width: px2pd(1080), height: px2pd(312), position: 'absolute' }}
        source={require('../../../../assets/clues/clues_toast_bg.png')}
      />
      <View style={{
        width: px2pd(1080),
        height: px2pd(312),
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'flex-end',
        paddingBottom: 25,
      }}>
        <Text style={{ fontSize: 14, color: "#fff", marginLeft: 23 }}>获得新{msg.cluesType}</Text>
        <ContentComponent content={msg.content} showEnd={showEnd} />
      </View>
    </LeftToRightSwiper>
  )
}

export default CluesToast

const styles = StyleSheet.create({
  textStyle: {
    textShadowColor: '#000',
    textShadowRadius: 3,
    shadowOpacity: 0,
  }
})
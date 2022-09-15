import { StyleSheet, Text, View, Animated, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { px2pd } from '../../../constants/resolution';

import TextAnimation from '../../textAnimation';
import Clues from '../../cluesList';

const viewWidth = px2pd(1000);
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
    if (index <= contentIndex) {
      if (index < contentIndex - 1) {
        return (
          <TextAnimation
            key={index}
            fontSize={18}
            type={'TextFadeIn'}
            style={{ color: '#fff', opacity: 0.5 }}>
            {item}
          </TextAnimation>
        )
      }
      return <TextAnimation
        key={index}
        fontSize={18}
        type={'TextFadeIn'}
        style={{ color: '#fff', opacity: 1 }}>
        {item}
      </TextAnimation>
    }
  })

  return (
    <TouchableWithoutFeedback onPress={() => { Clues.show() }}>
      <View style={{
        height: 90,
        width: "100%",
        justifyContent: "flex-end",
        marginLeft: 80,
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
      <View style={{ flex: 1, backgroundColor: '#ccc' }}>
        <ContentComponent content={msg.content} showEnd={showEnd} />
        <Text style={{ fontSize: 18, color: "#000" }}>获得新{msg.cluesType}</Text>
      </View>
    </LeftToRightSwiper>
  )
}

export default CluesToast

const styles = StyleSheet.create({
})
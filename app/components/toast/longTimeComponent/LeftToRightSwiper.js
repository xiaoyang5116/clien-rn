import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

const viewWidth = 200;

const GoodAndEvil = ({ msg }) => {
  const maxValue = 100
  const translateX = (50 / maxValue) * msg.value

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{msg.key}</Text>
      <View style={{ height: 20, width: 100, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 100, backgroundColor: "#fff", height: 5, position: "absolute" }}></View>
        <View style={{ width: 1, height: 10, backgroundColor: "red", transform: [{ translateX: -translateX }] }}></View>
      </View>
      <Text style={styles.title}>冷漠</Text>
      <Text style={styles.title}>{msg.changeValue > 0 ? `+${msg.changeValue}` : `-${msg.changeValue}`}</Text>
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
        delay: 1200,
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
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: opacityAnim,
        backgroundColor: "green"
      }}>
      {children}
    </Animated.View>
  );
};


const AttributesComponent = (props) => {
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
        <Text style={styles.title}>{msg.key}</Text>
        <View style={{ height: 20, width: 100 }}>
        </View>
        <Text style={styles.title}>{msg.value}</Text>
        <Text style={styles.title}>{msg.changeValue > 0 ? `+${msg.changeValue}` : `-${msg.changeValue}`}</Text>
      </View>
    </LeftToRightSwiper>
  )
}

export default AttributesComponent;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
    height: "100%",
    backgroundColor: '#ccc',
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
  }
});

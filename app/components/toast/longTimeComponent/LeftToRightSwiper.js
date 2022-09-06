import { StyleSheet, Text, View, Animated } from 'react-native'
import React from 'react'

const LeftToRightSwiper = (props) => {
  const { msg } = props


  return (
    <Animated.View style={{
      marginTop: 12,
      transform: [{ translateX: 0 }],
    }}>
      <View style={{ flexDirection: 'row', justifyContent: "center" }}>
        <Text>{msg.key}</Text>
        <Text>{msg.value}</Text>
      </View>
    </Animated.View>
  )
}

export default LeftToRightSwiper

const styles = StyleSheet.create({})
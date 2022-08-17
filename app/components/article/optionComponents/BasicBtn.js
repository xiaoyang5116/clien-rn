import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import React from 'react'

const BasicBtn = (props) => {
  const { onPress, title, containerStyle } = props

  return (
    <TouchableHighlight onPress={onPress}>
      <View style={{ ...containerStyle }}>
        <Text>{title}</Text>
      </View>
    </TouchableHighlight>
  )
}

export default BasicBtn

const styles = StyleSheet.create({})
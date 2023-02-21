import { StyleSheet, Text, View, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import React, { useState } from 'react';

import { px2pd } from '../../constants/resolution'

import { ImageButton } from '../../constants/custom-ui'
export { LongTextButton } from './LongTextButton'
import FastImage from 'react-native-fast-image';
export { BtnIcon } from './BtnIcon'


export const ReturnButton = (props) => {
  const BTN_STYLE = {
    width: px2pd(172),
    height: px2pd(178),
  }
  const { onPress } = props
  return <ImageButton {...BTN_STYLE}
    source={require('../../../assets/button/return_button.png')}
    selectedSource={require('../../../assets/button/return_button_selected.png')}
    onPress={onPress ? onPress : () => { }}
  />
}

export const ExitButton = (props) => {
  const BTN_STYLE = {
    width: px2pd(217),
    height: px2pd(220),
  }
  const { onPress } = props
  return <ImageButton {...BTN_STYLE}
    source={require('../../../assets/button/exit_button.png')}
    selectedSource={require('../../../assets/button/exit_button_selected.png')}
    onPress={onPress ? onPress : () => { }}
  />
}

export const ImageBtn = (props) => {
  const { onPress, source, selectedSource, imgStyle, containerStyle, children, disabled = false } = props
  const [isPress, setIsPress] = useState(false)

  return (
    <TouchableWithoutFeedback
      onPressIn={() => { setIsPress(!isPress) }}
      onPressOut={() => { setIsPress(!isPress) }}
      onPress={onPress}
      style={imgStyle}
      disabled={disabled}
    >
      <View style={{ justifyContent: 'center', alignItems: "center", ...imgStyle, ...containerStyle, }}>
        {
          isPress
            ? (<FastImage resizeMode="stretch" style={{ ...imgStyle, position: 'absolute' }}
              source={selectedSource}
            />)
            : (<FastImage resizeMode="stretch" style={{ ...imgStyle, position: 'absolute' }}
              source={source}
            />)
        }
        {children}
      </View>
    </TouchableWithoutFeedback>
  )
}
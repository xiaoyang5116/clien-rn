import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ImageButton } from '../../constants/custom-ui'
import { px2pd } from '../../constants/resolution'

export { LongTextButton } from './LongTextButton'

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
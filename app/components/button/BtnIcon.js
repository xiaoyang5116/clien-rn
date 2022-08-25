import { View, Text, Image } from 'react-native'
import React from 'react'

import { getBtnIcon } from '../../constants'

export const BtnIcon = (props) => {
  const id = props.id
  const style = props.style

  if (id === undefined) return null

  const icon = getBtnIcon(id)
  const attrs = {};
  if (icon.top != undefined) attrs.top = icon.top;
  if (icon.left != undefined) attrs.left = icon.left;
  if (icon.right != undefined) attrs.right = icon.right;

  const imageStyle = {};
  if (icon.width != undefined) imageStyle.width = icon.width;
  if (icon.height != undefined) imageStyle.height = icon.height;

  return (
    <View style={{ position: 'absolute', ...attrs, ...style }}>
      <Image source={icon.img} style={[{ width: 30, height: 30 }, imageStyle]} />
    </View>
  )
}

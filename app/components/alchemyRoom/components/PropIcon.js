import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import qualityStyle from '../../../themes/qualityStyle';
import { getPropIcon } from '../../../constants';
import { px2pd } from '../../../constants/resolution';

import FastImage from 'react-native-fast-image';


const PropIcon = (props) => {
  const { item } = props

  const quality_style = qualityStyle.styles.find(e => e.id == parseInt(item.quality));
  const image = getPropIcon(item.iconId);

  return (
    <FastImage style={{
      width: px2pd(100), height: px2pd(100),
      borderRadius: 5, borderWidth: 1, borderColor: quality_style.borderColor,
      backgroundColor: quality_style.backgroundColor,
    }}
      source={image.img}
    />
  );
}

export default PropIcon

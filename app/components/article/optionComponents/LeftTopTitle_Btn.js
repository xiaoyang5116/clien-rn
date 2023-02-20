import { StyleSheet, Text, View, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';
import { ImageBtn } from '../../../constants/custom-ui';

const imgData = {
  top: {
    size: { width: px2pd(1070), height: px2pd(57), },
    default: require('../../../../assets/button/leftTop_titleButton/default/top.png'),
    disabled: require('../../../../assets/button/leftTop_titleButton/disabled/top.png'),
  },
  center: {
    size: { width: px2pd(1070), height: px2pd(98), },
    default: require('../../../../assets/button/leftTop_titleButton/default/center_1.png'),
    default_click: require('../../../../assets/button/leftTop_titleButton/default/center_2.png'),
    // disabled
    disabled: require('../../../../assets/button/leftTop_titleButton/disabled/center_1.png'),
    disabled_click: require('../../../../assets/button/leftTop_titleButton/disabled/center_2.png'),
  },
}

const LeftTopTitle_Btn = props => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } = props;
  const { leftTop_Title, icon } = optionData;

  const handlerOnPress = () => {
    if (disabled) {
      Toast.show("条件不满足")
    } else {
      onPress()
    }
  }

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <ImageBackground
        style={{ ...imgData.top.size, justifyContent: 'center', paddingLeft: 30, paddingTop: px2pd(5) }}
        source={disabled ? imgData.top.disabled : imgData.top.default}
      >
        <Text style={{ fontSize: 14, color: "#000" }}>{leftTop_Title}</Text>
      </ImageBackground>
      <ImageBtn
        imgStyle={imgData.center.size}
        onPress={handlerOnPress}
        source={disabled ? imgData.center.disabled : imgData.center.default}
        selectedSource={disabled ? imgData.center.disabled_click : imgData.center.default_click}
      >
        {icon?.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
        <Text style={{ fontSize: 14, color: "#000" }}>{title}</Text>
      </ImageBtn>
    </View>
  )
};

export default LeftTopTitle_Btn;

const styles = StyleSheet.create({
});

import { StyleSheet, Text, View, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';
import { ImageBtn } from '../../../constants/custom-ui';


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
    <View style={{ width: px2pd(1067), }}>
      <ImageBackground
        style={{ width: px2pd(1067), height: px2pd(57), justifyContent: 'center', paddingLeft: 30, paddingTop: px2pd(5) }}
        source={require('../../../../assets/button/topbot_btn/left_top.png')}
      >
        <Text style={{ fontSize: 14, color: "#000" }}>{leftTop_Title}</Text>
      </ImageBackground>
      <ImageBtn
        imgStyle={{ width: px2pd(1067), height: px2pd(98), }}
        onPress={handlerOnPress}
        source={require('../../../../assets/button/topbot_btn/left_top1.png')}
        selectedSource={require('../../../../assets/button/topbot_btn/left_top2.png')}
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

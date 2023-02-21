import { StyleSheet, Text, View, TouchableHighlight, ImageBackground } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon, ImageBtn } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';


const imgData = {
  center: {
    size: { width: px2pd(1070), height: px2pd(98), },
    default: require('../../../../assets/button/rightBottom_titleButton/default/center_1.png'),
    default_click: require('../../../../assets/button/rightBottom_titleButton/default/center_2.png'),
    // disabled
    disabled: require('../../../../assets/button/rightBottom_titleButton/disabled/center_1.png'),
    disabled_click: require('../../../../assets/button/rightBottom_titleButton/disabled/center_2.png'),
  },
  bottom: {
    size: { width: px2pd(1070), height: px2pd(56), },
    default: require('../../../../assets/button/rightBottom_titleButton/default/bottom.png'),
    disabled: require('../../../../assets/button/rightBottom_titleButton/disabled/bottom.png'),
  }
}

const RightBottomTitle_Btn = props => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } = props;
  const { rightBottom_Title, icon } = optionData;

  const handlerOnPress = () => {
    if (disabled) {
      Toast.show("条件不满足")
    } else {
      onPress()
    }
  }

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <ImageBtn
        imgStyle={imgData.center.size}
        onPress={handlerOnPress}
        source={disabled ? imgData.center.disabled : imgData.center.default}
        selectedSource={disabled ? imgData.center.disabled_click : imgData.center.default_click}
      >
        {icon?.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
        <Text style={{ fontSize: 14, color: "#000" }}>{title}</Text>
      </ImageBtn>
      <ImageBackground
        resizeMode="stretch"
        style={{ ...imgData.bottom.size, justifyContent: 'center', paddingLeft: px2pd(292), }}
        source={disabled ? imgData.bottom.disabled : imgData.bottom.default}
      >
        <Text style={{ fontSize: 14, width: px2pd(713), textAlign: 'center', color: "#000", paddingBottom: px2pd(4) }}>{rightBottom_Title}</Text>
      </ImageBackground>
    </View>
  )

};

export default RightBottomTitle_Btn

const styles = StyleSheet.create({
});

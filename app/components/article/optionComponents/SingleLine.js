import { StyleSheet, Text, View, TouchableHighlight, ImageBackground } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon, ImageBtn } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';


const imgData = {
  center: {
    size: { width: px2pd(1070), height: px2pd(98), },
    default: require('../../../../assets/button/center_titleButton/default.png'),
    default_click: require('../../../../assets/button/center_titleButton/default_click.png'),
    // disabled
    disabled: require('../../../../assets/button/center_titleButton/disabled.png'),
    disabled_click: require('../../../../assets/button/center_titleButton/disabled_click.png'),
  },
}



const SingleLine = (props) => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } = props;
  const { icon } = optionData;

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
    </View>
  )

}

export default SingleLine

const styles = StyleSheet.create({})
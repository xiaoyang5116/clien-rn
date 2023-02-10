import { StyleSheet, Text, View, TouchableHighlight, ImageBackground } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon, ImageBtn } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';


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
    <View style={{ width: px2pd(1067) }}>
      <ImageBtn
        imgStyle={{ width: px2pd(1067), height: px2pd(98), }}
        onPress={handlerOnPress}
        source={require('../../../../assets/button/topbot_btn/content1.png')}
        selectedSource={require('../../../../assets/button/topbot_btn/content2.png')}
      >
        {icon?.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
        <Text style={{ fontSize: 14, color: "#000" }}>{title}</Text>
      </ImageBtn>
    </View>
  )

}

export default SingleLine

const styles = StyleSheet.create({})
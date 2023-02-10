import { StyleSheet, Text, View, TouchableHighlight, ImageBackground } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon, ImageBtn } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';


const TopAndBottomTitle_Btn = props => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } = props;
  const { leftTop_Title, rightBottom_Title, icon } = optionData;

  const handlerOnPress = () => {
    if (disabled) {
      Toast.show("条件不满足")
    } else {
      onPress()
    }
  }

  return (
    <View style={{ width: px2pd(1067) }}>
      <ImageBackground
        style={{ width: px2pd(1067), height: px2pd(57), justifyContent: 'center', paddingLeft: 30, paddingTop: px2pd(5), }}
        source={require('../../../../assets/button/topbot_btn/left_top.png')}
      >
        <Text style={{ fontSize: 14, color: "#000" }}>{leftTop_Title}</Text>
      </ImageBackground>
      <ImageBtn
        imgStyle={{ width: px2pd(1067), height: px2pd(98), }}
        onPress={handlerOnPress}
        source={require('../../../../assets/button/topbot_btn/left_bot1.png')}
        selectedSource={require('../../../../assets/button/topbot_btn/left_bot2.png')}
      >
        {icon?.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
        <Text style={{ fontSize: 14, color: "#000" }}>{title}</Text>
      </ImageBtn>
      <ImageBackground
        style={{ width: px2pd(1067), height: px2pd(56), justifyContent: 'center', paddingLeft: px2pd(292), }}
        source={require('../../../../assets/button/topbot_btn/right_bottom.png')}
      >
        <Text style={{ fontSize: 14, width: px2pd(713), textAlign: 'center', color: "#000" }}>{rightBottom_Title}</Text>
      </ImageBackground>
    </View>
  )

};

export default TopAndBottomTitle_Btn

const styles = StyleSheet.create({
});


import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton, BtnIcon } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';

const BTN_STYLE = {
  width: px2pd(1067),
  height: px2pd(155),
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
    <View style={{
      width: "100%",
      marginTop: 5,
      marginBottom: 5,
      justifyContent: "center",
      alignItems: "center",
      height: px2pd(155),
      ...containerStyle
    }}>
      <ImageButton
        {...BTN_STYLE}
        onPress={handlerOnPress}
        source={require('../../../../assets/button/LeftTopTitle_Btn1.png')}
        selectedSource={require('../../../../assets/button/LeftTopTitle_Btn2.png')}
      />
      <View style={{ ...BTN_STYLE, position: "absolute", }} pointerEvents="none">
        <View style={{
          width: px2pd(600),
          height: px2pd(55),
          marginTop: px2pd(1),
          marginLeft: px2pd(120),
        }}>
          <Text style={{ fontSize: 14, }}>
            {leftTop_Title}
          </Text>
        </View>
        <View style={{
          width: px2pd(980),
          height: px2pd(88),
          marginLeft: px2pd(45),
          marginTop: px2pd(5),
          justifyContent: "center",
          alignItems: "center"
        }}>
          {icon.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
          <Text>{title}</Text>
        </View>
      </View>
    </View>
  )
};

export default LeftTopTitle_Btn;

const styles = StyleSheet.create({
});

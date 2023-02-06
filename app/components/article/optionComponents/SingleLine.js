import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import React from 'react';
import Toast from '../../toast';

import { ImageButton } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';

const BTN_STYLE = {
  width: px2pd(1067),
  height: px2pd(98),
}


const SingleLine = (props) => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } = props;
  const { leftTop_Title } = optionData;

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
      height: px2pd(98),
      ...containerStyle
    }}>
      <ImageButton
        {...BTN_STYLE}
        onPress={handlerOnPress}
        source={require('../../../../assets/button/singleLine_1.png')}
        selectedSource={require('../../../../assets/button/singleLine_2.png')}
      />
      <View style={{ ...BTN_STYLE, position: "absolute", }} pointerEvents="none">
        <View style={{
          width: px2pd(980),
          height: px2pd(98),
          marginLeft: px2pd(45),
          marginTop: px2pd(2),
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text>{title}</Text>
        </View>
      </View>
    </View>
  )
}

export default SingleLine

const styles = StyleSheet.create({})
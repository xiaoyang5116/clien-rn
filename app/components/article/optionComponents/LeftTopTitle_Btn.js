import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import React from 'react';
import Toast from '../../toast';

const LeftTopTitle_Btn = props => {
  const { title, disabled, onPress, currentStyles, optionData } = props;
  const { leftTop_Title } = optionData;

  const handlerOnPress = () => {
    if (disabled) {
      Toast.show("条件不满足")
    } else {
      onPress()
    }
  }

  return (
    <TouchableHighlight underlayColor={"#fff"}
      style={{
        marginTop: 5,
        marginBottom: 5,
      }}
      onPress={handlerOnPress}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: disabled
            ? '#999'
            : currentStyles.button.backgroundColor,
          borderColor: '#666',
          borderWidth: 1,
          borderRadius: 3,
        }}>
        <View
          style={{
            position: 'absolute',
            zIndex: 2,
            left: -1,
            top: -10,
            backgroundColor: '#C3C0C0',
          }}>
          <Text
            style={{
              fontSize: 14,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
            }}>
            {leftTop_Title}
          </Text>
        </View>
        <Text
          style={[
            styles.textStyle,
            {
              color: currentStyles.button.color,
            },
          ]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default LeftTopTitle_Btn;

const styles = StyleSheet.create({
  textStyle: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: 'center',
    fontSize: 18,
  },
});

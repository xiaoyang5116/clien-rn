import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const Header3 = (props) => {
  const theme = useContext(ThemeContext);

  const { onClose, title, containerStyle, fontStyle, iconColor, iconStyle, iconSize } = props

  const _iconColor = iconColor ? iconColor : "#fff"
  const _iconStyle = iconStyle ? iconStyle : { marginLeft: 12 }
  const _iconSize = iconSize ? iconSize : 23

  return (
    <View style={{ justifyContent: 'center', ...containerStyle }}>
      <View style={{ position: 'absolute', zIndex: 2 }}>
        <TouchableOpacity onPress={() => { if (onClose != undefined) onClose() }}>
          <AntDesign
            name="left"
            color={_iconColor}
            size={_iconSize}
            style={_iconStyle}
          />
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: 'center', fontSize: 24, color: '#fff', ...fontStyle }}>
        {title}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({});

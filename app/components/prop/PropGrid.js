import React from 'react';

import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getPropIcon } from '../../constants';
import { px2pd } from '../../constants/resolution';
import lo from 'lodash';

const PropGrid = (props) => {
  
    let propImage = <></>
    let propLabel = <></>
    let propNum = <></>
    if (props.prop != undefined) {
      const image = getPropIcon(props.prop.iconId);
      propImage = (
        <FastImage source={image.img} style={{ width: image.width, height: image.height }} />
      );
      propLabel = <Text numberOfLines={1} style={[{ color: '#fff', fontSize: 13 }, (props.labelStyle != undefined) ? props.labelStyle : {}]}>{props.prop.name}</Text>
      if ((props.showNum == undefined) || (lo.isBoolean(props.showNum) && props.showNum)) {
        propNum = <Text style={{ position: 'absolute', bottom: 1, right: 5, color: '#ccc', fontSize: 12 }}>{props.prop.num}</Text>
      }
    }
  
    return (
      <TouchableWithoutFeedback onPress={() => {
        if (props.onClick != undefined) {
            props.onClick();
        }
      }}>
        <View style={[props.style, styles.viewContainer]} pointerEvents='none'>
          {propImage} 
          {propNum}
          <View style={{ position: 'absolute', bottom: -20, width: 50, justifyContent: 'center', alignItems: 'center' }}>
            {propLabel}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        width: px2pd(120), 
        height: px2pd(120), 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 10, 
        backgroundColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
      }
});

export default PropGrid;
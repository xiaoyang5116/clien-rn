import React from 'react';
import PropTypes from 'prop-types';

import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { errorMessage, getPropIcon } from '../../constants';
import { px2pd } from '../../constants/resolution';
import qualityStyle from '../../themes/qualityStyle';
import lo from 'lodash';

const PropGrid = (props) => {

    const quality_style = qualityStyle.styles.find(e => e.id == props.prop.quality);
  
    let propImage = <></>
    let propLabel = <></>
    let propNum = <></>

    const viewContainerStyle = {};

    if (props.prop != undefined) {
      const image = getPropIcon(props.prop.iconId);
      const imgStyle = { width: image.width, height: image.height };
      if (props.imageStyle != undefined && props.imageStyle.width != undefined) imgStyle.width = props.imageStyle.width;
      if (props.imageStyle != undefined && props.imageStyle.height != undefined) imgStyle.height = props.imageStyle.height;

      // 计算出格子的宽高
      viewContainerStyle.width = imgStyle.width;
      viewContainerStyle.height = imgStyle.height;

      // 道具图片
      propImage = (
        <FastImage source={image.img} style={[imgStyle, {
          borderRadius: 5, borderWidth: 1, borderColor: quality_style.borderColor, 
          backgroundColor: quality_style.backgroundColor }]} />
      );

      // 道具名称标签
      if ((props.showLabel == undefined) || (lo.isBoolean(props.showLabel) && props.showLabel)) {
        propLabel = <Text numberOfLines={1} style={[{ color: '#fff', fontSize: 13 }, (props.labelStyle != undefined) ? props.labelStyle : {}]}>{props.prop.name}</Text>
      }

      // 道具数量
      if ((props.showNum == undefined) || (lo.isBoolean(props.showNum) && props.showNum)) {
        propNum = <Text style={styles.numStyle}>{props.prop.num}</Text>
      }
    } else {
      errorMessage('PropGrid组件请指定prop属性');
    }

    return (
      <TouchableWithoutFeedback onPress={() => {
        if (props.onClick != undefined) {
            props.onClick();
        }
      }}>
        <View style={[props.style, styles.viewContainer, viewContainerStyle]}>
          {propImage} 
          {propNum}
          <View style={{ position: 'absolute', bottom: -20, width: 50, justifyContent: 'center', alignItems: 'center' }}>
            {propLabel}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
}

PropGrid.propTypes = {
  prop: PropTypes.object,
  style: PropTypes.object,
  imageStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  showNum: PropTypes.bool,
  showLabel: PropTypes.bool,
};

PropGrid.defaultProps = {
  style: {},
  imageStyle: {},
  showNum: true,
  showLabel: true,
};

const styles = StyleSheet.create({
    viewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    numStyle: {
      position: 'absolute', 
      bottom: 1, 
      right: 2, 
      color: '#fff', 
      fontWeight: 'bold', 
      fontSize: 12, 
      textShadowColor: '#000', 
      textShadowRadius: 2, 
      shadowOpacity: 0,
    },
});

export default PropGrid;
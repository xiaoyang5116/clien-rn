import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

import qualityStyle from '../../../themes/qualityStyle';
import { getPropIcon } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import RootView from '../../RootView';

import FastImage from 'react-native-fast-image';
import PropTips from '../../tips/PropTips'


const PropIcon = props => {
  const { item } = props;

  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(item.quality),
  );
  const image = getPropIcon(item.iconId);

  const openPropDetail = () => {
    const key = RootView.add(
      <PropTips
        viewOnly={true}
        propId={item.propId}
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  };

  return (
    <TouchableWithoutFeedback onPress={openPropDetail}>
      <FastImage
        style={{
          width: px2pd(100),
          height: px2pd(100),
          borderRadius: 5,
          borderWidth: 1,
          borderColor: quality_style.borderColor,
          backgroundColor: quality_style.backgroundColor,
        }}
        source={image.img}
      />
    </TouchableWithoutFeedback>
  );
};

export default PropIcon;



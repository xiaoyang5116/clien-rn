import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { timeLeft, h_m_s_Format } from '../../utils/DateTimeUtils';
import Toast from '../toast';

import { HalfPanel } from '../panel';
import { Header3 } from '../header';
import { TextButton } from '../../constants/custom-ui';
import ImageCapInset from 'react-native-image-capinsets-next';
import PropIcon from '../alchemyRoom/components/PropIcon';

const SpeedPage = props => {
  return (
    <HalfPanel
      backgroundColor={'rgba(0,0,0,0.7)'}
      source={require('../../../assets/plant/plantBg.jpg')}
      borderRadius={10}
      zIndex={99}>
      <Header3
        title={'供奉加速'}
        onClose={props.onClose}
        containerStyle={{ marginTop: 12 }}
      />
    </HalfPanel>
  )
};

export default SpeedPage;

const styles = StyleSheet.create({});

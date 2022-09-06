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
  const { onClose, onSpeedUp, prop } = props
  const { allSpeedTime, currentNeedTime, worshipSpeedUpTime } = props.data
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
      <View>
        <Text>全部贡品加速:{h_m_s_Format(allSpeedTime)}</Text>
      </View>
      <View>
        <Text>可加速时间: {h_m_s_Format(worshipSpeedUpTime)}</Text>
      </View>
      <View>
        <Text>{prop.name}: {h_m_s_Format(currentNeedTime)}</Text>
      </View>

    </HalfPanel>
  )
};

export default SpeedPage;

const styles = StyleSheet.create({});

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
  const { allWorshipNeedTime, currentNeedTime, worshipSpeedUpTime } = props.data

  const worshipSpeed = (data) => {
    onSpeedUp(data)
    onClose()
  }
  return (
    <HalfPanel
      backgroundColor={'rgba(0,0,0,0.7)'}
      source={require('../../../assets/plant/plantBg.jpg')}
      borderRadius={10}
      zIndex={99}>
      <Header3
        title={'选择供奉加速时间'}
        onClose={props.onClose}
        containerStyle={{ marginTop: 12 }}
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {
          if (allWorshipNeedTime > worshipSpeedUpTime) return Toast.show("供奉时间不足")
          worshipSpeed({ type: "allSpeedTime", time: allWorshipNeedTime })
        }}>
          <View style={styles.item_container}>
            <Text style={styles.text}>全部贡品加速:{h_m_s_Format(allWorshipNeedTime)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          if (worshipSpeedUpTime <= 0) return Toast.show("供奉时间不足")
          worshipSpeed({ type: "canSpeedTime", time: worshipSpeedUpTime })
        }}>
          <View style={styles.item_container}>
            <Text style={styles.text}>可加速时间: {h_m_s_Format(worshipSpeedUpTime)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          if (currentNeedTime > worshipSpeedUpTime) return Toast.show("供奉时间不足")
          worshipSpeed({ type: "currentSpeedTime", time: currentNeedTime })
        }}>
          <View style={styles.item_container}>
            <Text style={styles.text}>{prop.name}: {h_m_s_Format(currentNeedTime)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </HalfPanel>
  )
};

export default SpeedPage;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  item_container: {
    marginTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fff"
  },
  text: {
    fontSize: 18,
    color: "#fff"
  }
});

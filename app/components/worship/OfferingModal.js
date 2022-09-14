import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { timeLeft } from '../../utils/DateTimeUtils';
import Toast from '../toast';

import { HalfPanel } from '../panel';
import { Header3 } from '../header';
import { TextButton } from '../../constants/custom-ui';
import ImageCapInset from 'react-native-image-capinsets-next';
import PropIcon from '../alchemyRoom/components/PropIcon';

const OfferingModal = props => {
  const { data, onClose, addWorshipProp, gridId } = props;
  const [worshipProp, setWorship] = useState({})

  const renderItem = ({ item }) => {
    const { name, worshipTime } = item;
    const propIconData = {
      propId: item.id,
      iconId: item.iconId,
      quality: item.quality,
    };
    return (
      <TouchableOpacity onPress={() => { setWorship(item) }}>
        <View
          style={{
            height: 45,
            borderWidth: 1,
            borderColor: worshipProp.id === item.id ? "#0BD86A" : '#000',
            borderRadius: 3,
            marginTop: 12,
            backgroundColor: 'rgba(255,255,255,0.5)',
          }}>
          <ImageCapInset
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            source={require('../../../assets/button/40dpi_gray.png')}
            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
              alignItems: 'center',
            }}>
            <PropIcon item={propIconData} />
            <Text style={{ flex: 1, fontSize: 16, color: '#000', marginLeft: 8 }}>
              {name}
            </Text>
            <Text style={{ flex: 1, fontSize: 16, color: '#000', marginLeft: 8 }}>
              {timeLeft(worshipTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <HalfPanel
      backgroundColor={'rgba(0,0,0,0.7)'}
      source={require('../../../assets/plant/plantBg.jpg')}
      borderRadius={10}
      zIndex={99}>
      <Header3
        title={'供奉材料选择'}
        onClose={props.onClose}
        containerStyle={{ marginTop: 12 }}
      />
      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 12,
        }}>
        <TextButton
          title={'确定'}
          onPress={() => {
            if (worshipProp.id === undefined) return Toast.show("请选择供奉材料")
            addWorshipProp({ worshipProp, gridId })
            onClose();
          }}
        />
        <TextButton title={'取消'} onPress={onClose} />
      </View>
    </HalfPanel>
  );
};

export default OfferingModal;

const styles = StyleSheet.create({});

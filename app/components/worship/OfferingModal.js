import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react';

import { timeLeft } from '../../utils/DateTimeUtils';
import Toast from '../toast';

import { HalfPanel } from '../panel';
import { Header3 } from '../header';
import { TextButton } from '../../constants/custom-ui';
import ImageCapInset from 'react-native-image-capinsets-next';
import PropIcon from '../alchemyRoom/components/PropIcon';
import { px2pd } from '../../constants/resolution';
import FastImage from 'react-native-fast-image';

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
            padding: 2,
            width: px2pd(880),
            height: px2pd(171),
            marginTop: 12,
            justifyContent: "center",
            alignItems: 'center'
          }}>
          <FastImage
            source={require('../../../assets/worship/cailiao_bg2.png')}
            style={{
              width: px2pd(880),
              height: px2pd(171),
              position: "absolute",
              borderWidth: 1,
              borderRadius: 3,
              borderColor: worshipProp.id === item.id ? "#0BD86A" : '#000',
            }}
          />
          <ImageCapInset
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            source={require('../../../assets/button/40dpi_gray.png')}
            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
          />
          <View
            style={{
              flex: 1,
              width: "100%",
              flexDirection: 'row',
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
              alignItems: 'center',
              justifyContent: "flex-start",
            }}>
            <PropIcon item={propIconData} />
            <Text style={{ fontSize: 16, color: '#000', marginLeft: 12 }}>
              {name}
            </Text>
            <Text style={{ fontSize: 18, color: '#000', position: 'absolute', right: 12, }}>
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
      width={px2pd(997)}
      height={px2pd(1651)}
      source={require('../../../assets/worship/cailiao_bg.png')}
      zIndex={99}
    >
      <View style={{ width: "100%", height: px2pd(137), justifyContent: 'center' }}>
        <View style={{ width: "100%", position: "absolute", alignItems: 'center' }}>
          <FastImage
            source={require('../../../assets/worship/cailiao_title.png')}
            style={{ width: px2pd(987), height: px2pd(137), }}
          />
        </View>
        <Header3
          title={'奉上供品'}
          onClose={props.onClose}
        />
      </View>

      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
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

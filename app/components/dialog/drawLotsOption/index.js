import { FlatList, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { HalfPanel } from '../../panel';
// import { TextButton } from '../../../constants/custom-ui';
// import { getBtnIcon } from '../../../constants';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';
import { ReturnButton } from '../../button';

const icons = [
  { id: 1, img: require('../../../../assets/dialog/draw_lots/1.png') },
  { id: 2, img: require('../../../../assets/dialog/draw_lots/2.png') },
  { id: 3, img: require('../../../../assets/dialog/draw_lots/3.png') },
  { id: 4, img: require('../../../../assets/dialog/draw_lots/4.png') },
  { id: 5, img: require('../../../../assets/dialog/draw_lots/5.png') },
]

function getIcon(id) {
  return icons.find(item => item.id === id).img
}

const DrawLotsOption = props => {
  const { actionMethod, viewData, onDialogCancel } = props;
  const { title, sections } = viewData;
  const [checkedOption, setCheckedOption] = useState(null);

  const handlerDrawLots = () => {
    if (checkedOption != null) return;
    const result = Math.floor(Math.random() * 100) + 1;
    const checkedItem = sections.find(item => {
      const range = item.rate.split(',');
      if (range[0] === '>') return result > Number(range[1]);
      if (range[0] === '<') return result < Number(range[1]);
      if (range[0] === '>=') return result >= Number(range[1]);
      if (range[0] === '<=') return result <= Number(range[1]);
    });

    setCheckedOption(checkedItem);
    setTimeout(() => {
      actionMethod(checkedItem);
      onDialogCancel();
    }, 2000);
  };

  const _renderOption = ({ item, index }) => {
    const icon = getIcon(item.iconId);
    return (
      <View style={styles.optionContainer}>
        <ImageBackground
          source={require('../../../../assets/dialog/draw_lots/contentBg.png')}
          style={styles.optionItem}
        >
          <Image source={icon} style={{ width: px2pd(70), height: px2pd(130), position: 'absolute', zIndex: 2, left: 4 }} />
          <Text
            style={{
              fontSize: 16,
              color: item.id === checkedOption?.id ? 'red' : '#000',
              marginLeft: 8,
            }}>
            {item.content}
          </Text>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99
    }}>
      <View style={{
        width: px2pd(1080),
        height: px2pd(1805)
      }}>
        {/* 背景 */}
        <FastImage
          style={{ position: "absolute", zIndex: 0, width: px2pd(1080), height: px2pd(1805) }}
          source={require('../../../../assets/dialog/draw_lots/bg.png')}
        />
        {/* header */}
        <FastImage
          style={{ width: "100%", height: px2pd(134) }}
          source={require('../../../../assets/dialog/draw_lots/title.png')}
        />
        <View style={{ width: "100%", alignItems: 'center', marginTop: 20 }}>
          <FastImage
            style={{ width: px2pd(431), height: px2pd(676) }}
            source={require("../../../../assets/dialog/draw_lots/tong.png")}
          />
          <TouchableOpacity style={{ position: "absolute", bottom: 0 }} onPress={handlerDrawLots}>
            <FastImage
              style={{ width: px2pd(425), height: px2pd(427) }}
              source={require("../../../../assets/dialog/draw_lots/clickBtn.png")}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{ marginLeft: 12, marginTop: 12 }}>
        <Text style={{ fontSize: 16, color: '#000' }}>{title}</Text>
      </View> */}
        {/* <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
        <TextButton title={'选择'} onPress={handlerDrawLots} />
      </View> */}
        <View style={{ width: "100%", marginTop: 20 }}>
          <FlatList
            data={sections}
            renderItem={_renderOption}
            extraData={checkedOption}
          />
        </View>
        <View style={{ position: "absolute", left: 12, bottom: -40 }}>
          <ReturnButton onPress={onDialogCancel} />
        </View>
      </View>
    </View>
  );
};

export default DrawLotsOption;

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    height: px2pd(130),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionItem: {
    width: px2pd(943),
    height: px2pd(101),
    paddingLeft: px2pd(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
});

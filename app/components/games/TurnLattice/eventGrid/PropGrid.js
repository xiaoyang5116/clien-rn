import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import qualityStyle from '../../../../themes/qualityStyle';
import { action, connect, getPropIcon, EventKeys } from '../../../../constants';

import { Grid_CanOpen, Grid_HaveOpened, Grid_NotOpen } from '../Grid'
import FastImage from 'react-native-fast-image';

// 道具格子
const PropGrid = (props) => {
  const { item, openGrid, isTouchStart, setGridConfig, handlerGridEvent, isTrigger } = props
  const { prop } = item.event
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(prop.quality),
  );
  const image = getPropIcon(prop.iconId);

  if (item.status === 0) {
    return <Grid_NotOpen isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return (
      <Grid_CanOpen
        item={{ ...item, isTrigger }}
        openGrid={openGrid}
        isTouchStart={isTouchStart}
        containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <FastImage
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: quality_style.borderColor,
            backgroundColor: quality_style.backgroundColor,
          }}
          source={image.img}
        />
      </Grid_CanOpen>
    );
  }
  if (item.status === 2) {
    return (
      <Grid_HaveOpened>
        <TouchableOpacity
          onPressIn={() => { isTouchStart.current = false }}
          onPressOut={() => { isTouchStart.current = true }}
          onPress={() => {
            // playEffect({ soundId: "SE_UE_0013" })
            handlerGridEvent(item)
          }}>
          <View
            style={[
              styles.gridContainer,
              { justifyContent: 'center', alignItems: 'center' },
            ]}>
            <FastImage
              style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: quality_style.borderColor,
                backgroundColor: quality_style.backgroundColor,
              }}
              source={image.img}
            />
          </View>
        </TouchableOpacity>
      </Grid_HaveOpened>
    );
  }
  return <Grid_NotOpen />;
}

export default PropGrid

const styles = StyleSheet.create({
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: 'rgba(0,0,0)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
})
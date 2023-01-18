import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import qualityStyle from '../../../../themes/qualityStyle';
import { action, connect, getBtnIcon, EventKeys } from '../../../../constants';

import { Grid_CanOpen, Grid_HaveOpened, Grid_NotOpen } from '../Grid'
import FastImage from 'react-native-fast-image';

const DialogGrid = (props) => {
  const { item, openGrid, isTouchStart, setGridConfig, handlerGridEvent, isTrigger } = props
  const { iconId } = item.event
  const image = getBtnIcon(iconId)

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
          onPress={() => handlerGridEvent(item)}>
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

export default DialogGrid

const styles = StyleSheet.create({
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
})
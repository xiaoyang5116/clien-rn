import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { Grid_CanOpen, Grid_HaveOpened, Grid_NotOpen } from '../Grid'
import FastImage from 'react-native-fast-image';

const imgData = {
  opened: require('../../../../../assets/games/turnLattice/baoxiang_opened.png'),
  unOpen: require('../../../../../assets/games/turnLattice/baoxiang_unOpen.png')
}

const TreasureChestGrid = (props) => {
  const { item, openGrid, isTouchStart, setGridConfig, handlerGridEvent } = props
  const { treasureChestIsOpen } = item.event
  const img = treasureChestIsOpen ? imgData.opened : imgData.unOpen

  // 点击宝箱
  const handlerClick = () => {
    if (treasureChestIsOpen) {

    } else {
      handlerGridEvent(item)
    }
  }

  if (item.status === 0) {
    return <Grid_NotOpen isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return (
      <Grid_CanOpen
        item={item}
        openGrid={openGrid}
        isTouchStart={isTouchStart}
        containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <FastImage
          style={{ width: "100%", height: "100%" }}
          source={img}
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
          onPress={handlerClick}>
          <View
            style={[
              styles.gridContainer,
              { justifyContent: 'center', alignItems: 'center' },
            ]}>
            <FastImage
              style={{ width: "100%", height: "100%" }}
              source={img}
            />
          </View>
        </TouchableOpacity>
      </Grid_HaveOpened>
    );
  }
  return <Grid_NotOpen />;
}

export default TreasureChestGrid

const styles = StyleSheet.create({
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
})
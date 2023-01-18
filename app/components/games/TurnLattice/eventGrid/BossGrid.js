import { StyleSheet, Text, View, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import React, { useEffect } from 'react'

import qualityStyle from '../../../../themes/qualityStyle';
import { action, connect, getBossIcon, EventKeys } from '../../../../constants';

import { Grid_CanOpen, Grid_HaveOpened, Grid_NotOpen } from '../Grid'
import FastImage from 'react-native-fast-image';

// Boss格子
const BossGrid = (props) => {
  const { item, openGrid, isTouchStart, setGridConfig, handlerGridEvent, isTrigger } = props
  const { bossIconId, challenge } = item.event

  const image = getBossIcon(bossIconId);

  const meetBoss = () => {
    props.dispatch(action('TurnLatticeModel/meetBossEvent')({ item })).then(result => {
      if (result !== undefined) {
        setGridConfig([...result]);
      }
    });
  }

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(`${EventKeys.CHALLENGE_END_RESULT}_${challenge}`, (result) => {
      if (result) {
        props.dispatch(action('TurnLatticeModel/challengeWin')({ item })).then(result => {
          if (result !== undefined) {
            setGridConfig([...result]);
          }
        });
      }
    });
    return () => {
      listener.remove()
    }
  }, [])

  if (item.status === 0) {
    return <Grid_NotOpen isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return (
      <Grid_CanOpen
        item={{ ...item, isTrigger }}
        openGrid={meetBoss}
        isTouchStart={isTouchStart}
        containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <FastImage
          style={{
            width: "100%",
            height: "100%",
          }}
          source={image}
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
              source={image}
            />
          </View>
        </TouchableOpacity>
      </Grid_HaveOpened>
    );
  }
  return <Grid_NotOpen />;
}

export default BossGrid

const styles = StyleSheet.create({
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: 'rgba(0,0,0)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
})
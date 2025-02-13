import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  SafeAreaView,
  Animated,
  PanResponder,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

import qualityStyle from '../../../themes/qualityStyle';
import { action, connect, getPropIcon, EventKeys } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import Toast from '../../toast';
import { ArticleOptionActions } from '../../article';
import { confirm } from '../../dialog';

import FastImage from 'react-native-fast-image';
import { TextButton } from '../../../constants/custom-ui';
import RootView from '../../RootView';
import PopComponent from './PopComponent';

import PropGrid from './eventGrid/PropGrid';
import TreasureChestGrid from './eventGrid/TreasureChestGrid';
import BossGrid from './eventGrid/BossGrid';
import DialogGrid from './eventGrid/DialogGrid';
import { playEffect } from '../../sound/utils';

// 事件类型:  "道具" || "战斗" || "剧情"

// 格子status: 0-不可翻开 || 1-可翻开 || 2-已翻开
// 不可翻开状态
export const Grid_NotOpen = ({ isOpened }) => {
  return (
    <View
      style={[
        styles.gridContainer,
      ]}
    >
      {
        isOpened
          ? <FastImage style={{ flex: 1 }} source={require("../../../../assets/games/turnLattice/grid/blue_2.png")} />
          : <FastImage style={{ flex: 1 }} source={require("../../../../assets/games/turnLattice/grid/blue_1.png")} />
      }
    </View>
  );
};

// 可翻开状态
export const Grid_CanOpen = ({
  item,
  openGrid,
  isTouchStart,
  children = null,
  containerStyle
}) => {
  const { isProhibit, isTrigger = true, event } = item

  return (
    <TouchableHighlight
      onPressIn={() => {
        isTouchStart.current = false;
      }}
      onPressOut={() => {
        isTouchStart.current = true;
      }}
      onPress={() => {
        if (!isProhibit && isTrigger) {
          openGrid()
          playEffect({ soundId: "SE_UE_0014" })
        }
        if (isTrigger === false) {
          confirm('未触发对应剧情');
        }
      }}>
      <View style={[styles.gridContainer, containerStyle]}>
        <FastImage style={{ position: 'absolute', width: "100%", height: "100%", zIndex: 3, }} source={require('../../../../assets/games/turnLattice/grid/red_2.png')} />
        {
          (isProhibit || !isTrigger)
            ? (
              <View
                style={{
                  ...styles.gridContainer,
                  position: 'absolute',
                  zIndex: 4,
                }}
              >
                <FastImage
                  style={{ width: '100%', height: "100%" }}
                  source={require('../../../../assets/games/turnLattice/prohibit.png')}
                />
              </View>
            )
            : event != undefined
              ? (
                <View
                  style={{
                    ...styles.gridContainer,
                    position: 'absolute',
                    zIndex: 4,
                  }}
                >
                  <FastImage
                    resizeMode="contain"
                    style={{ width: '100%', height: "100%" }}
                    source={require('../../../../assets/animations/onomatopoeia/feiwu_gantanhao.png')}
                  />
                </View>
              )
              : <></>
        }
        {children}
      </View>
    </TouchableHighlight>
  );
};

// 已翻开状态
export const Grid_HaveOpened = ({ children, containerStyle }) => {
  return <View style={[styles.gridContainer, containerStyle]} children={children} />;
};

// 入口格子
const Grid_Entrance = props => {
  return (
    <View style={[styles.gridContainer]}>
      <FastImage
        style={{ width: '100%', height: '100%' }}
        source={require('../../../../assets/games/turnLattice/entrance.png')}
      />
    </View>
  );
};

// 出口格子
const Grid_Export = (props) => {
  const { item, openGrid, isTouchStart, turnLatticeData, currentLayer, setGridConfig, onClose } = props
  const [isHaveKey, setIsHaveKey] = useState(false)

  const exportHandler = () => {
    // playEffect({ soundId: "SE_UE_0001" })
    if (isHaveKey) {
      const text = (item.toChapter != undefined && item.toLayer === undefined) ? "恭喜通关!" : `确认进入下一层？`
      confirm(text,
        () => {
          props
            .dispatch(action('TurnLatticeModel/exportGrid')({ ...item }))
            .then(result => {
              if (result !== undefined && result != null) {
                setGridConfig([...result]);
              }
            });
        });
    } else {
      confirm('没有钥匙', () => { });
    }
  }

  const img = isHaveKey ? require('../../../../assets/games/turnLattice/door_2.png') : require('../../../../assets/games/turnLattice/door_1.png')

  useEffect(() => {
    let fun = props.dispatch(action('TurnLatticeModel/isHaveKey')({ item })).then((result) => {
      if (result && result != isHaveKey) {
        setIsHaveKey(result)
      }
    })

    return () => {
      fun = null
    }
  }, [setGridConfig])



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
          onPress={exportHandler}>
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
  return <Grid_NotOpen isOpened={item.isOpened} />;
};

// 空格子
const Grid_Empty = ({ item, openGrid, isTouchStart }) => {
  if (item.status === 0) {
    return <Grid_NotOpen isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_CanOpen item={item} openGrid={openGrid} isTouchStart={isTouchStart} />;
  }
  if (item.status === 2) {
    return <Grid_HaveOpened />;
  }
  return <Grid_NotOpen />;
};

// 墙格子
const Grid_Wall = () => {
  return <View style={[styles.gridContainer,]} >
    <FastImage style={{ flex: 1 }} source={require("../../../../assets/games/turnLattice/grid/blue_1.png")} />
  </View>;
};

// 事件格子
const Grid_Event = (props) => {
  const { event } = props.item;
  const [isTrigger, setIsTrigger] = useState(true)
  useEffect(() => {
    if (props.item.andVarsOn != undefined || props.item.varsOff != undefined) {
      props.dispatch(action('TurnLatticeModel/checkEventStatus')({ ...props.item }))
        .then((result) => {
          if (result != undefined) {
            setIsTrigger(result)
          }
        })
    }
  }, [])

  if (event.type === '道具') {
    return <PropGrid {...props} isTrigger={isTrigger} />;
  }
  if (event.type === '宝箱') {
    return <TreasureChestGrid {...props} isTrigger={isTrigger} />;
  }
  if (event.type === '战斗') {
    return <BossGrid {...props} isTrigger={isTrigger} />;
  }
  if (event.type === '剧情') {
    return <DialogGrid {...props} isTrigger={isTrigger} />;
  }

  return <Grid_NotOpen />;
};

// 格子
const Grid = props => {
  const { item, isTouchStart, openGrid } = props;
  switch (item.type) {
    case '入口':
      return <Grid_Entrance />;

    case '出口':
      return <Grid_Export {...props} />;

    case '墙':
      return <Grid_Wall />;

    case '空':
      return <Grid_Empty {...props} />;
    case '事件':
      return <Grid_Event {...props} />;

    default:
      return <Grid_Empty {...props} />;
  }
};

export default Grid;

const styles = StyleSheet.create({
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: 'rgba(0,0,0)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});

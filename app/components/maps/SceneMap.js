
import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  TouchableWithoutFeedback,
} from '../../constants/native-ui';

import {
  Animated,
  PanResponder,
} from 'react-native';

import { 
  getWindowSize
} from '../../constants';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import Easing from 'react-native/Libraries/Animated/Easing';

const WIN_SIZE = getWindowSize();

// 格子间隔
const GRID_SPACE = 20;
// 斜线修正
const GRID_SLASH_FIXED = 4;
// 格子宽度
const GRID_PX_WIDTH = px2pd(290);
// 格子高度
const GRID_PX_HEIGHT = px2pd(84);
// 地图magin值
const MAP_MARGIN_VALUE = 4;

// 小地图尺寸
const MAP_SMALL_SIZE = { width: px2pd(1064), height: px2pd(464) };
// 大地图尺寸
const MAP_BIG_SIZE = { width: px2pd(1064), height: px2pd(1664) };

const LINES = [
  { direction: 1, style: { width: px2pd(142), height: px2pd(142) }, img: require('../../../assets/bg/map_line1.png') },
  { direction: 2, style: { width: px2pd(142), height: px2pd(142) }, img: require('../../../assets/bg/map_line2.png') },
  { direction: 3, style: { width: px2pd(142), height: px2pd(142) }, img: require('../../../assets/bg/map_line3.png') },
  { direction: 4, style: { width: px2pd(142), height: px2pd(142) }, img: require('../../../assets/bg/map_line4.png') },
]

const getLineConfig = (p1, p2) => {
  if (p1[0] == p2[0] && p1[1] != p2[1])
    return { direction: 1, style: (p1[1] < p2[1]) ? { bottom: 0 } : { top: 0 } };
  else if (p1[0] != p2[0] && p1[1] == p2[1])
    return { direction: 2, style: (p1[0] < p2[0]) ? { right: (0 - GRID_SPACE) } : { left: (0 - GRID_SPACE) } };
  else if ((p1[0] < p2[0] && p1[1] < p2[1]) || (p1[0] > p2[0] && p1[1] > p2[1]))
    return { direction: 3, style: (p1[1] < p2[1]) ? { right: (0 - GRID_SPACE - GRID_SLASH_FIXED), bottom: GRID_SLASH_FIXED } : { left: 0 - (GRID_SPACE + GRID_SLASH_FIXED), top: GRID_SLASH_FIXED } };
  else if ((p1[0] < p2[0] && p1[1] > p2[1]) || (p1[0] > p2[0] && p1[1] < p2[1]))
    return { direction: 4, style: (p1[1] < p2[1]) ? { left: (0 - GRID_SPACE - GRID_SLASH_FIXED), bottom: GRID_SLASH_FIXED } : { right: (0 - GRID_SPACE - GRID_SLASH_FIXED), top: GRID_SLASH_FIXED } };
  else
    return null;
}

const SceneMap = (props) => {
  // 初始化起始坐标
  const initialXY = {
    x: ((MAP_SMALL_SIZE.width - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_WIDTH / 2) - (props.initialCenterPoint[0] * (GRID_PX_WIDTH + GRID_SPACE)),
    y: ((MAP_SMALL_SIZE.height - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_HEIGHT / 2) + (props.initialCenterPoint[1] * (GRID_PX_HEIGHT + GRID_SPACE)),
  };

  // 地图移动坐标
  const mapPos = React.useRef(new Animated.ValueXY(initialXY)).current;
  // 各种状态数据
  const status = React.useRef({ prevX: 0, prevY: 0 }).current;
  // 大地图坐标
  const bigMapTransY = React.useRef(new Animated.Value(WIN_SIZE.height)).current;
  // 大地图事件模型
  const [bigPointerEvent, setBigPointerEvent] = React.useState('none');

  // 滑动处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      status.prevX = mapPos.x._value;
      status.prevY = mapPos.y._value;
    },
    onPanResponderMove: (evt, gestureState) => {
      mapPos.setValue({ x: status.prevX + gestureState.dx, y: status.prevY + gestureState.dy });
      console.debug('move');
    },
    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = mapPos.x._value;
      status.prevY = mapPos.y._value;
    },
  })).current;

  const maxMapHandler = (e) => {
    Animated.timing(bigMapTransY, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start((r) => {
      const { finished } = r;
      if (finished) {
        setBigPointerEvent('auto');
      }
    });
  }

  const minMapHandler = (e) => {
    Animated.timing(bigMapTransY, {
      toValue: WIN_SIZE.height,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start((r) => {
      const { finished } = r;
      if (finished) {
        setBigPointerEvent('none');
      }
    });
  }

  // 渲染格子
  const grids = [];
  // 渲染线条
  const lines = [];

  let idx = 0;
  props.data.forEach(e => {
    const left = e.point[0] * (GRID_PX_WIDTH + GRID_SPACE);
    const top = (-e.point[1]) * (GRID_PX_HEIGHT + GRID_SPACE);

    if (lo.isArray(e.links)) {
      e.links.forEach(lp => {
        const config = getLineConfig(e.point, lp);
        if (config == null)
          return;
        //
        const line = LINES.find(e => e.direction == config.direction);
        lines.push((
          <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]}>
            <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...config.style }, { ...line.style }]} source={line.img} />
          </View>
        ));
      });
    }

    grids.push((
      <TouchableWithoutFeedback key={idx++} onPress={() => {
        console.debug('press ', e);
      }}>
        <View style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]}>
          <FastImage style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }} source={require('../../../assets/button/scene_map_button.png')} />
          <Text style={{ color: '#000', zIndex: 1 }}>{e.title}</Text>
        </View>
      </TouchableWithoutFeedback>));
  });

  return (
    <View style={[{}, { ...MAP_SMALL_SIZE }]} {...panResponder.panHandlers}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={require('../../../assets/bg/scene_map.png')} />

      {/* 小地图网格 */}
      <View style={{ flex: 1, margin: 4, overflow: 'hidden' }}>
        <Animated.View style={{ position: 'absolute', transform: [{ translateX: initialXY.x }, { translateY: initialXY.y }] }}>
          {lines}
          {grids}
        </Animated.View>
      </View>

      {/* 最大化按钮 */}
      <TouchableWithoutFeedback onPress={maxMapHandler}>
        <FastImage style={{ position: 'absolute', right: 10, top: -6, width: px2pd(106), height: px2pd(46) }} source={require('../../../assets/button/map_maximize_button.png')} />
      </TouchableWithoutFeedback>

      {/* 大地图 */}
      <View style={[{ position: 'absolute', bottom: 0, overflow: 'hidden' }, { width: MAP_BIG_SIZE.width, height: MAP_BIG_SIZE.height + 10 }]} pointerEvents={bigPointerEvent}>
        <Animated.View style={[{ position: 'absolute', bottom: 0 }, { transform: [{ translateY: bigMapTransY }] }, { ...MAP_BIG_SIZE }]}>
          <FastImage style={[{ position: 'absolute', width: '100%', height: '100%' }]} source={require('../../../assets/bg/scene_map_big.png')} />
          {/* 大地图网格 */}
          <View style={{ flex: 1, margin: 4, overflow: 'hidden' }}>
            <Animated.View style={{ position: 'absolute', transform: [{ translateX: mapPos.x }, { translateY: mapPos.y }] }}>
              {lines}
              {grids}
            </Animated.View>
          </View>
          {/* 缩小按钮 */}
          <TouchableWithoutFeedback onPress={minMapHandler}>
            <FastImage style={{ position: 'absolute', right: 10, top: -6, width: px2pd(106), height: px2pd(46) }} source={require('../../../assets/button/map_min_button.png')} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </View>
  );
}



SceneMap.propTypes = {
  // 地图数据
  data: PropTypes.array,
  // 起始中心点
  initialCenterPoint: PropTypes.array,
};

SceneMap.defaultProps = {
  data: [],
  initialCenterPoint: [0, 0],
};

export default SceneMap;
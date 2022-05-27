
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
    x: ((props.mapSize.width - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_WIDTH / 2) - (props.initialCenterPoint[0] * (GRID_PX_WIDTH + GRID_SPACE)),
    y: ((props.mapSize.height - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_HEIGHT / 2) + (props.initialCenterPoint[1] * (GRID_PX_HEIGHT + GRID_SPACE)),
  };

  // 地图移动坐标
  const mapPos = React.useRef(new Animated.ValueXY(initialXY)).current;
  // 各种状态数据
  const status = React.useRef({ prevX: 0, prevY: 0 }).current;

  // 滑动处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      status.prevX = mapPos.x._value;
      status.prevY = mapPos.y._value;
    },
    onPanResponderMove: (evt, gestureState) => {
      mapPos.setValue({ x: status.prevX + gestureState.dx, y: status.prevY + gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = mapPos.x._value;
      status.prevY = mapPos.y._value;
    },
  })).current;

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
    // <View style={{ flex: 1, overflow: 'hidden' }} {...panResponder.panHandlers}>
    //   <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={require('../../../assets/bg/scene_map.png')} />
    //   <Animated.View style={{ position: 'absolute', transform: [{ translateX: mapPos.x }, { translateY: mapPos.y }] }}>
    //     {lines}
    //     {grids}
    //   </Animated.View>
    // </View>
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={require('../../../assets/bg/scene_map.png')} />
      <View style={{ flex: 1, margin: 4, overflow: 'hidden' }}>
        <Animated.View style={{ position: 'absolute', transform: [{ translateX: mapPos.x }, { translateY: mapPos.y }] }}>
          {lines}
          {grids}
        </Animated.View>
      </View>
    </View>
  );
}



SceneMap.propTypes = {
  // 地图数据
  data: PropTypes.array,
  // 地图尺寸
  mapSize: PropTypes.object,
  // 起始中心点
  initialCenterPoint: PropTypes.array,
};

SceneMap.defaultProps = {
  data: [],
  mapSize: { width: WIN_SIZE.width, height: WIN_SIZE.height },
  initialCenterPoint: [0, 0],
};

export default SceneMap;
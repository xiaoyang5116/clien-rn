
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
  AppDispath,
  getWindowSize
} from '../../constants';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import Toast from '../toast';

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

// 大地图尺寸
const MAP_BIG_SIZE = { width: px2pd(1028), height: px2pd(1650) };
// 地图线条尺寸
const MAP_LINE_SIZE = { width: px2pd(142), height: px2pd(142) };
const MAP_XLINE_SIZE = { width: px2pd(350), height: px2pd(142) };
// 地图转角尺寸
const MAP_CORNER_SIZE = { width: px2pd(142), height: px2pd(142) };

const LINES = [
  { direction: 1, style: MAP_LINE_SIZE, img: require('../../../assets/bg/map_line1.png') },
  { direction: 2, style: MAP_XLINE_SIZE, img: require('../../../assets/bg/map_line2B.png') },
  { direction: 3, style: MAP_LINE_SIZE, img: require('../../../assets/bg/map_line3.png') },
  { direction: 4, style: MAP_LINE_SIZE, img: require('../../../assets/bg/map_line4.png') },
]

const CORNERS = [
  { angle: 1, style: MAP_CORNER_SIZE, img: require('../../../assets/bg/map_corner1.png') },
  { angle: 2, style: MAP_CORNER_SIZE, img: require('../../../assets/bg/map_corner2.png') },
  { angle: 3, style: MAP_CORNER_SIZE, img: require('../../../assets/bg/map_corner3.png') },
  { angle: 4, style: MAP_CORNER_SIZE, img: require('../../../assets/bg/map_corner4.png') },
]

const getLineConfig = (p1, p2) => {
  if (p1[0] == p2[0] && p1[1] != p2[1])
    return { direction: 1, style: (p1[1] < p2[1]) ? { bottom: 0 } : { top: 0 } };
  else if (p1[0] != p2[0] && p1[1] == p2[1])
    return { direction: 2, style: (p1[0] < p2[0]) ? { right: (0 - GRID_SPACE - GRID_PX_WIDTH / 2) } : { left: (0 - GRID_SPACE - GRID_PX_WIDTH / 2) } };
  else if ((p1[0] < p2[0] && p1[1] < p2[1]) || (p1[0] > p2[0] && p1[1] > p2[1]))
    return { direction: 3, style: (p1[1] < p2[1]) ? { right: (0 - GRID_SPACE - GRID_SLASH_FIXED), bottom: GRID_SLASH_FIXED } : { left: 0 - (GRID_SPACE + GRID_SLASH_FIXED), top: GRID_SLASH_FIXED } };
  else if ((p1[0] < p2[0] && p1[1] > p2[1]) || (p1[0] > p2[0] && p1[1] < p2[1]))
    return { direction: 4, style: (p1[1] < p2[1]) ? { left: (0 - GRID_SPACE - GRID_SLASH_FIXED), bottom: GRID_SLASH_FIXED } : { right: (0 - GRID_SPACE - GRID_SLASH_FIXED), top: GRID_SLASH_FIXED } };
  else
    return null;
}

// 计算两个点之间连线经过的所有点
const buildLinkPath = (p1, p2) => {
  // console.debug('---------> ', p1, p2);
  const path = [p1];
  for (let i = p1[1] + 1; i <= p2[1]; i++) {
    for (let j = p1[0]; j < p2[0]; j++) {
      // console.debug(`[${j}, ${i}]`);
      path.push([j, i]);
    }
  }
  path.push(p2);
  return path;
}

const DirMap = (props) => {
  // 大地图初始化起始坐标
  const bigMapInitXY = {
    x: ((MAP_BIG_SIZE.width - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_WIDTH / 2) - (props.initialCenterPoint[0] * (GRID_PX_WIDTH + GRID_SPACE)),
    y: ((MAP_BIG_SIZE.height - MAP_MARGIN_VALUE * 2) / 2) - (GRID_PX_HEIGHT / 2) + (props.initialCenterPoint[1] * (GRID_PX_HEIGHT + GRID_SPACE)),
  }

  // 大地图移动坐标
  const bigMapPos = React.useRef(new Animated.ValueXY(bigMapInitXY)).current;
  // 各种状态数据
  const status = React.useRef({ prevX: 0, prevY: 0 }).current;
  // 大地图坐标
  const bigMapTransY = React.useRef(new Animated.Value(0)).current;
  // 大地图缩放
  const bigMapScale = React.useRef(new Animated.Value(1)).current;

  // 地图滑动处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
    onPanResponderMove: (evt, gestureState) => {
      bigMapPos.setValue({ x: status.prevX + gestureState.dx, y: status.prevY + gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
  })).current;

  // 大地图缩小
  const zoomOutBigMapHandler = (e) => {
    const value = bigMapScale._value;
    if (value <= 0.6) {
      Toast.show('已经缩放至最小', 'CenterToTop');
      return;
    }
    bigMapScale.setValue(value * 0.9);
  }

  // 大地图放大
  const zoomInBigMapHandler = (e) => {
    const value = bigMapScale._value;
    if (value >= 2) {
      Toast.show('已经缩放至最大', 'CenterToTop');
      return;
    }
    bigMapScale.setValue(value * 1.1);
  }

  // 大地图缩放还原
  const zoomRestoreBigMapHandler = (e) => {
    bigMapScale.setValue(1);
    bigMapPos.setValue(bigMapInitXY);
  }

  // 渲染格子
  const grids = [];
  // 渲染线条
  const lines = [];

  let idx = 0;
  props.data.forEach(e => {
    const left = e.point[0] * (GRID_PX_WIDTH + GRID_SPACE);
    const top = (-e.point[1]) * (GRID_PX_HEIGHT + GRID_SPACE);
    const isCenterPoint = (e.point[0] == props.initialCenterPoint[0] && e.point[1] == props.initialCenterPoint[1]);

    if (lo.isArray(e.links)) {
      e.links.forEach(lp => {
        const needCorner = ((Math.abs(e.point[0]) - Math.abs(lp[0])) >= 2) || ((Math.abs(e.point[1]) - Math.abs(lp[1])) >= 2);
        if (needCorner) {
          const path = buildLinkPath(e.point, lp);
          for (let i = 0; i < path.length; i++) {
            const prev = path[i - 1];
            const current = path[i];
            const next = path[i + 1];
            console.debug('point: ', current);

            if (current != undefined && next != undefined) {
              const lineConfig = getLineConfig(current, next);
              if (lineConfig != null) {
                const lineLeft = current[0] * (GRID_PX_WIDTH + GRID_SPACE);
                const lineTop = (-current[1]) * (GRID_PX_HEIGHT + GRID_SPACE);
                const line = LINES.find(e => e.direction == lineConfig.direction);
                lines.push((
                  <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left: lineLeft, top: lineTop }]}>
                    <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...lineConfig.style }, { ...line.style }]} source={line.img} />
                  </View>
                ));
              }
            }

            if (prev != null && current != undefined && next != undefined) {
              if (prev[0] == current[0] && prev[1] < current[1] && next[0] > current[0] && current[1] == next[1]) { // 转角1
                const cornerLeft = current[0] * (GRID_PX_WIDTH + GRID_SPACE);
                const cornerTop = (-current[1]) * (GRID_PX_HEIGHT + GRID_SPACE);
                const corner = CORNERS.find(e => e.angle == 1);

                lines.push((
                  <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left: cornerLeft, top: cornerTop }]}>
                    <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...corner.style }]} source={corner.img} />
                  </View>
                ));
                console.debug('---> corner', current);
              }
            }
          }
        } else {
          const lineConfig = getLineConfig(e.point, lp);
          if (lineConfig != null) {
            const line = LINES.find(e => e.direction == lineConfig.direction);
            lines.push((
              <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]}>
                <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...lineConfig.style }, { ...line.style }]} source={line.img} />
              </View>
            ));
          }
        }
      });
    }

    const gridImg = isCenterPoint 
      ? require('../../../assets/button/scene_map_button.png') 
      : require('../../../assets/button/scene_map_button2.png');

    grids.push((
      <TouchableWithoutFeedback key={idx++} onPress={() => {
        if (lo.isString(e.toScene)) {
          AppDispath({ type: 'SceneModel/processActions', payload: { toScene: e.toScene } });
        }
      }}>
        <View style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]}>
          <FastImage style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }} source={gridImg} />
          <Text style={{ color: '#000', zIndex: 1 }}>{e.title}</Text>
        </View>
      </TouchableWithoutFeedback>));
  });

  return (
  <View style={[{ position: 'absolute' }, { width: MAP_BIG_SIZE.width, height: MAP_BIG_SIZE.height }]} {...panResponder.panHandlers}>
    <Animated.View style={[{ position: 'absolute', bottom: 0 }, { transform: [{ translateY: bigMapTransY }] }, { ...MAP_BIG_SIZE }]}>
      {/* 大地图网格 */}
      <View style={{ flex: 1, margin: 4, overflow: 'hidden' }}>
        <Animated.View style={{ position: 'absolute', transform: [{ translateX: bigMapPos.x }, { translateY: bigMapPos.y }, { scale: bigMapScale }] }}>
          {lines}
          {grids}
        </Animated.View>
      </View>
    </Animated.View>
    {/* 大地图缩小按钮 */}
    <TouchableWithoutFeedback onPress={zoomOutBigMapHandler}>
      <FastImage style={{ position: 'absolute', left: 8, top: -7, width: px2pd(106), height: px2pd(46) }} source={require('../../../assets/button/map_zoom_out_button.png')} />
    </TouchableWithoutFeedback>
    {/* 大地图放大按钮 */}
    <TouchableWithoutFeedback onPress={zoomInBigMapHandler}>
      <FastImage style={{ position: 'absolute', left: 53, top: -7, width: px2pd(106), height: px2pd(46) }} source={require('../../../assets/button/map_zoom_in_button.png')} />
    </TouchableWithoutFeedback>
    {/* 大地图还原按钮 */}
    <TouchableWithoutFeedback onPress={zoomRestoreBigMapHandler}>
      <FastImage style={{ position: 'absolute', left: 98, top: -7, width: px2pd(106), height: px2pd(46) }} source={require('../../../assets/button/map_restore_button.png')} />
    </TouchableWithoutFeedback>
  </View>
  );
}

DirMap.propTypes = {
  // 地图数据
  data: PropTypes.array,
  // 起始中心点
  initialCenterPoint: PropTypes.array,
};

DirMap.defaultProps = {
  data: [],
  initialCenterPoint: [0, 0],
};

export default DirMap;
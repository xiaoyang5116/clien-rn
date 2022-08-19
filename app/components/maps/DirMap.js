
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
import Toast from '../toast';

const WIN_SIZE = getWindowSize();

// 格子间隔
const GRID_SPACE = 20;
// 斜线修正
const GRID_SLASH_FIXED = 4;
// 格子宽度
const GRID_PX_WIDTH = px2pd(306);
// 格子高度
const GRID_PX_HEIGHT = px2pd(64);
// 地图magin值
const MAP_MARGIN_VALUE = 4;

// 大地图尺寸
const MAP_BIG_SIZE = { width: px2pd(1028), height: px2pd(1650) };
// 地图线条尺寸
const MAP_LINE_SIZE = { width: px2pd(142), height: px2pd(142) };
// 地图水平线条尺寸
const MAP_XLINE_SIZE = { width: px2pd(362), height: px2pd(142) };
// 地图竖线条尺寸
const MAP_YLINE_SIZE = { width: px2pd(142), height: px2pd(120) };
// 地图转角尺寸
const MAP_CORNER_SIZE = { width: px2pd(142), height: px2pd(142) };

const LINES = [
  { direction: 1, style: MAP_YLINE_SIZE, img: require('../../../assets/bg/map_line1.png') },
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
    return { direction: 1, style: (p1[1] < p2[1]) ? { bottom: GRID_PX_HEIGHT / 2 } : { top: GRID_PX_HEIGHT / 2 } };
  else if (p1[0] != p2[0] && p1[1] == p2[1])
    return { direction: 2, style: (p1[0] < p2[0]) ? { right: (0 - GRID_SPACE - GRID_PX_WIDTH / 2) } : { left: (0 - GRID_SPACE - GRID_PX_WIDTH / 2) } };
  else if ((p1[0] < p2[0] && p1[1] < p2[1]) || (p1[0] > p2[0] && p1[1] > p2[1]))
    return { direction: 3, style: (p1[1] < p2[1]) ? { right: (0 - GRID_SPACE - GRID_SLASH_FIXED - 8), bottom: GRID_SLASH_FIXED } : { left: 0 - (GRID_SPACE + GRID_SLASH_FIXED + 8), top: GRID_SLASH_FIXED } };
  else if ((p1[0] < p2[0] && p1[1] > p2[1]) || (p1[0] > p2[0] && p1[1] < p2[1]))
    return { direction: 4, style: (p1[1] < p2[1]) ? { left: (0 - GRID_SPACE - GRID_SLASH_FIXED - 8), bottom: GRID_SLASH_FIXED } : { right: (0 - GRID_SPACE - GRID_SLASH_FIXED - 8), top: GRID_SLASH_FIXED } };
  else
    return null;
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
  // 记录Grid点击状态（解决Grid与PanResponser的响应BUG）
  const touchStart = React.useRef(false);

  // 地图缩放限制
  const zoomMax = 2;
  const zoomMin = 0.6;

  // 是否开始双指
  let isTwoFinger = false;
  // 开始时双指简距离
  let initDistend = 0;

  // 地图滑动处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
    onPanResponderMove: (evt, gestureState) => {
      // 单指操作
      if (gestureState.numberActiveTouches === 1) {
        bigMapPos.setValue({ x: status.prevX + gestureState.dx, y: status.prevY + gestureState.dy });
      }
      // 双指操作
      if (gestureState.numberActiveTouches === 2) {
        let distend = Math.sqrt(
          Math.pow(evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX, 2) +
          Math.pow(evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY, 2)
        )
        if (!isTwoFinger) {
          isTwoFinger = true
          initDistend = distend
        }
        let scaleNumber = ((distend - initDistend) / 5000) + bigMapScale._value
        if (scaleNumber > zoomMax + 0.1) return;
        if (scaleNumber < zoomMin - 0.1) return;
        bigMapScale.setValue(scaleNumber)
      }

      if(gestureState.dx!==0 || gestureState.dy!==0){
        touchStart.current = false;
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
      initDistend = 0
      isTwoFinger = false
    },
  })).current;

  // 大地图缩小
  const zoomOutBigMapHandler = (e) => {
    const value = bigMapScale._value;
    if (value <= zoomMin) {
      Toast.show('已经缩放至最小', 'CenterToTop');
      return;
    }
    bigMapScale.setValue(value * 0.9);
  }

  // 大地图放大
  const zoomInBigMapHandler = (e) => {
    const value = bigMapScale._value;
    if (value >= zoomMax) {
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
        const lineConfig = getLineConfig(e.point, lp);
        if (lineConfig != null) {
          const line = LINES.find(e => e.direction == lineConfig.direction);
          lines.push((
            <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]}>
              <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...lineConfig.style }, { ...line.style }]} source={line.img} />
            </View>
          ));
        }
      });
    }
    if (lo.isArray(e.path)) {
      const path = [e.point, ...e.path];
      for (let i = 0; i < path.length; i++) {
        const prev = path[i - 1];
        const current = path[i];
        const next = path[i + 1];

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
          let angle = 0;
          if ((prev[0] == current[0] && prev[1] < current[1] && next[0] > current[0] && current[1] == next[1])
              || (prev[0] > current[0] && prev[1] == current[1] && next[0] == current[0] && current[1] > next[1])) {
            angle = 1;
          } else if ((prev[0] < current[0] && prev[1] == current[1] && next[0] == current[0] && current[1] > next[1])
                      || (prev[0] == current[0] && prev[1] < current[1] && next[0] < current[0] && current[1] == next[1])) {
            angle = 2;
          } else if ((prev[0] == current[0] && prev[1] > current[1] && next[0] < current[0] && current[1] == next[1])
                      || (prev[0] < current[0] && prev[1] == current[1] && next[0] == current[0] && current[1] < next[1])) {
            angle = 3;
          } else if ((prev[0] > current[0] && prev[1] == current[1] && next[0] == current[0] && current[1] < next[1])
                      || (prev[0] == current[0] && prev[1] > current[1] && next[0] > current[0] && current[1] == next[1])) {
            angle = 4;
          }

          if (angle > 0) {
            const cornerLeft = current[0] * (GRID_PX_WIDTH + GRID_SPACE);
            const cornerTop = (-current[1]) * (GRID_PX_HEIGHT + GRID_SPACE);
            const corner = CORNERS.find(e => e.angle == angle);
  
            lines.push((
              <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left: cornerLeft, top: cornerTop }]}>
                <FastImage key={idx++} style={[{ position: 'absolute', zIndex: -1 }, { ...corner.style }]} source={corner.img} />
              </View>
            ));
          }
        }
      }
    }

    const gridImg = isCenterPoint 
      ? require('../../../assets/button/dir_map_button.png') 
      : require('../../../assets/button/dir_map_button2.png');

    grids.push(
      <View key={idx++} style={[{ position: 'absolute', width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT, justifyContent: 'center', alignItems: 'center' }, { left, top }]} 
        onTouchStart={() => {
          touchStart.current = true;
        }}
        onTouchEnd={() => {
          if ((lo.isBoolean(e.lock) && e.lock) || !touchStart.current)
            return;
        
          touchStart.current = false;
          if (props.onEnterDir != undefined) {
            props.onEnterDir(e);
          }
        }}>
          <FastImage style={{ position: 'absolute', zIndex: 0, width: GRID_PX_WIDTH, height: GRID_PX_HEIGHT }} source={gridImg} />
          {(lo.isBoolean(e.lock) && e.lock) 
            ? <FastImage style={{ position: 'absolute', width: px2pd(39), height: px2pd(52) }} source={require('../../../assets/bg/lock.png')} /> 
            : <Text numberOfLines={1} style={{ color: '#000', fontSize: 12, zIndex: 1 }}>{e.title}</Text>
          }
      </View>);
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
      <FastImage style={{ position: 'absolute', left: 8, top: -9, width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_zoom_out_button.png')} />
    </TouchableWithoutFeedback>
    {/* 大地图放大按钮 */}
    <TouchableWithoutFeedback onPress={zoomInBigMapHandler}>
      <FastImage style={{ position: 'absolute', left: 60, top: -9, width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_zoom_in_button.png')} />
    </TouchableWithoutFeedback>
    {/* 大地图还原按钮 */}
    <TouchableWithoutFeedback onPress={zoomRestoreBigMapHandler}>
      <FastImage style={{ position: 'absolute', left: 112, top: -9, width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_restore_button.png')} />
    </TouchableWithoutFeedback>
    {/* 大地图关闭按钮 */}
    <TouchableWithoutFeedback onPress={props.onClose}>
      <FastImage style={{ position: 'absolute', right: 10, top: -9, width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_close_button.png')} />
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
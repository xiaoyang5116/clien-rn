
import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from '../../constants/native-ui';

import {
  Animated,
  PanResponder,
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';

import { getWindowHeight, getWindowWidth, px2pd } from '../../constants/resolution';
import { MAP_DATA } from './data/WorldMapData_1';

const MAP_ROWS = 20; 
const MAP_COLUMNS = 20;
const MAP_GRID_WIDTH = px2pd(600)
const MAP_GRID_HEIGHT = px2pd(600);

// 瓦片
const Grid = (props) => {
  return (
    <Animated.Image source={MAP_DATA[props.gridId]} style={[{ position: 'absolute', borderWidth: 1, borderColor: '#669900', width: px2pd(600), height: px2pd(600) }, props.style]} />
  );
}

// 根据瓦片ID生成四周的边界集合
const generateGridBound = (gridId) => {
    const rows = Math.floor(gridId / MAP_ROWS);
    const columns = gridId % MAP_COLUMNS;

    const bound = [];
    for (let y = 5; y > -5; y--) {
      const row = rows - y;
      for (let x = -3; x < 3; x++) {
        const column = columns + x;
        const id = (row * MAP_COLUMNS) + column;
        bound.push({ gridId: id, x: ((x != 0) ? -x : 0), y: y });
      }
    }
    return bound;
}

const WorldMap = (props) => {
  // 地图起始点坐标
  const mapInitXY = { 
    x: ((getWindowWidth() / 2) - MAP_GRID_WIDTH / 2), 
    y: ((getWindowHeight() / 2) - MAP_GRID_HEIGHT / 2)
  };

  // 地图位移
  const bigMapPos = React.useRef(new Animated.ValueXY(mapInitXY)).current;

  // 瓦片列表
  const [grids, setGrids] = React.useState([]);

  // 各种状态数  
  const status = React.useRef({ prevX: 0, prevY: 0 }).current;

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
        const x = status.prevX + gestureState.dx;
        const y = status.prevY + gestureState.dy;
        bigMapPos.setValue({ x, y });

        const diffX = mapInitXY.x - x; // 距离出生点偏移量X
        const diffY = mapInitXY.y - y; // 距离出生点偏移量Y
        const diffColumns = Math.floor(diffX / MAP_GRID_WIDTH); // 距离出生点偏移列数
        const diffRows = Math.floor(diffY / MAP_GRID_HEIGHT); // 距离出生点偏离行数
        const gridId = (MAP_COLUMNS * ((MAP_ROWS / 2) + (diffRows - 1))) + ((MAP_COLUMNS / 2) + diffColumns); // 中心点瓦片ID

        setGrids((list) => {
          const boundGridIds = generateGridBound(gridId);
          const newGrids = [];

          lo.forEach(boundGridIds, (item) => {
            const found = lo.find(list, (v) => (parseInt(v.key) == item.gridId));
            if (found == undefined) {
              const grid = (<Grid key={item.gridId} gridId={item.gridId} style={[
                { transform: [{ translateX: bigMapPos.x }, { translateY: bigMapPos.y }] },
                { left: ((diffColumns - item.x) * MAP_GRID_WIDTH), top: ((diffRows - item.y) * MAP_GRID_HEIGHT) }
              ]} />);
              newGrids.push(grid);
            } else {
              newGrids.push(found);
            }
          });

          if (newGrids.length <= 0) {
            return list; // 没发生变化，直接返回。
          }

          return [...newGrids];
        });
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
  })).current;

  return (
  <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, { borderWidth: 2, borderColor: '#669900' }]} {...panResponder.panHandlers}>
    {/* 瓦片集合 */}
    <View style={{ flex: 1 }}>
      {grids}
    </View>

    {/* 角色 */}
    <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <FastImage source={require('../../../assets/bg/explore_person.png')} style={{ width: px2pd(185), height: px2pd(166) }} />
    </View>

    {/* 大地图关闭按钮 */}
    <View style={{ position: 'absolute', right: px2pd(20), top: 50 }} onTouchStart={() => {
      if (props.onClose != undefined) {
        props.onClose();
      }
    }}>
      <FastImage style={{ width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_close_button.png')} />
    </View>
  </View>
  );
}

WorldMap.propTypes = {
  // 地图数据
  data: PropTypes.array,
  // 起始中心点
  initialCenterPoint: PropTypes.array,
};

WorldMap.defaultProps = {
  data: [],
  initialCenterPoint: [0, 0],
};

export default WorldMap;

import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from '../../constants/native-ui';

import {
  Animated,
  Image,
  PanResponder,
  Platform,
  Text,
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';

import { DataContext, getWindowSize, statusBarHeight } from '../../constants';
import { px2pd } from '../../constants/resolution';
import { TextButton } from '../../constants/custom-ui';
import { MAP_DATA } from './data/WorldMapData_1';
import { ArticleOptionActions } from '../article';
import RootView from '../RootView';
import { TouchableWithoutFeedback } from 'react-native';

// 加载瓦片地图到 window.TileMaps
require('./tiled/world_map');

const MAP_ROWS = 20; 
const MAP_COLUMNS = 20;
const MAP_GRID_WIDTH = px2pd(600)
const MAP_GRID_HEIGHT = px2pd(600);
const WIN_SIZE = getWindowSize();

const OFFSET_X = (WIN_SIZE.width / 2) - (MAP_GRID_WIDTH / 2);
const OFFSET_Y = (WIN_SIZE.height / 2) - (MAP_GRID_HEIGHT / 2);

// 左边距限制
const OFFSET_X_LEFT_LIMIT = ((MAP_COLUMNS * MAP_GRID_WIDTH) / 2) - (WIN_SIZE.width / 2) + (MAP_GRID_WIDTH / 2);
// 右边距限制
const OFFSET_X_RIGHT_LIMIT = -(OFFSET_X_LEFT_LIMIT - (((MAP_COLUMNS % 2) == 0) ? MAP_GRID_WIDTH : 0));
// 底边距限制
const OFFSET_Y_BOTTOM_LIMIT = -(((MAP_ROWS * MAP_GRID_HEIGHT) / 2) - (WIN_SIZE.height / 2) + (MAP_GRID_HEIGHT / 2));
// 顶边距限制
const OFFSET_Y_TOP_LIMIT = Math.abs(OFFSET_Y_BOTTOM_LIMIT) - (((MAP_ROWS % 2) == 0) ? MAP_GRID_HEIGHT : 0);

// 位置箭头
const LocationPin = (props, ref) => {
  const dataContext = React.useContext(DataContext);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [-180, 180],
    outputRange: ['360deg', '0deg']
  });

  useImperativeHandle(ref, () => ({
    setSpinValue: (v) => {
      spinValue.setValue(v);
    },
  }));

  return (
    <TouchableWithoutFeedback 
      onPressIn={() => { dataContext.pressIn = true; }} 
      onPressOut={() => { dataContext.pressIn = false; }}
      onPress={() => {
        if (props.onPress != undefined) {
          props.onPress();
        }
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View style={{ transform: [{ rotate: '180deg' }] }}>
          <Entypo name='location-pin' color={"#669900"} size={60} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const LocationPinWrapper = forwardRef(LocationPin);

// 瓦片
const Grid = (props) => {
  return (
    <>
      <Image source={MAP_DATA[props.gridId]} style={[
        { position: 'absolute', width: MAP_GRID_WIDTH, height: MAP_GRID_HEIGHT }, 
        lo.isEqual(Platform.OS, 'android') ? { borderWidth: 1 } : {}, // 必须要设置，否则Android很卡，什么原因？ 
        props.style
      ]} />
      {/* <Text style={[
        { position: 'absolute', color: '#fff', fontSize: 26, fontWeight: 'bold' }, 
        { margin: 10 },
        props.style
      ]}>{props.gridId}</Text> */}
    </>
  );
}

// 地图对象
const MapObject = (props) => {

  // Tiled Map对象坐标为左下角，RN坐标左上角，需要减掉自身高度做转换
  const tx = px2pd(props.data.x) - (MAP_COLUMNS * MAP_GRID_WIDTH) / 2;
  const ty = px2pd(props.data.y) - ((MAP_ROWS * MAP_GRID_HEIGHT) / 2) - px2pd(props.data.height);

  const onClose = () => {
    if (props.onClose != undefined) {
      props.onClose();
    }
  }

  let component = (<></>);
  if (props.data.gid == 1) {
    const found = lo.find(props.data.properties, (e) => lo.isEqual(e.name, 'toScene') && lo.isEqual(e.type, 'string'));
    if (found != undefined) {
      component = (<TextButton title={'场景'} style={{ width: '100%', height: '100%' }} onPress={() => {
        ArticleOptionActions.invoke({ toScene: found.value }, onClose);
      }} />);
    }
  } else if (props.data.gid == 2) {
    const found = lo.find(props.data.properties, (e) => lo.isEqual(e.name, 'openUI') && lo.isEqual(e.type, 'string'));
    if (found != undefined) {
      component = (<TextButton title={'功能'} style={{ width: '100%', height: '100%' }} onPress={() => {
        ArticleOptionActions.invoke({ openUI: found.value }, onClose);
      }} />);
    }
  } else if (props.data.gid == 3) {
    const found = lo.find(props.data.properties, (e) => lo.isEqual(e.name, 'toChapter') && lo.isEqual(e.type, 'string'));
    if (found != undefined) {
      component = (<TextButton title={'文章'} style={{ width: '100%', height: '100%' }} onPress={() => {
        ArticleOptionActions.invoke({ toChapter: found.value }, onClose);
      }} />);
    }
  }

  return (
    <View style={[
      { position: 'absolute', width: px2pd(props.data.width), height: px2pd(props.data.height), justifyContent: 'center', alignItems: 'center' },
      { left: OFFSET_X + tx, top: OFFSET_Y + ty + MAP_GRID_HEIGHT },
      props.style
    ]}>
      {component}
    </View>
  )
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
  // 出生点坐标
  const mapInitXY = { x: 0, y: 0 };

  // 地图位移
  const mapPos = React.useRef(new Animated.ValueXY(mapInitXY)).current;

  // 瓦片列表
  const [grids, setGrids] = React.useState([]);

  // 地图对象
  const [objects, setObjects] = React.useState([]);

  // 全局数据
  const dataContext = React.useContext(DataContext);

  // 方向箭头引用
  const refLocationPin = React.useRef(null);

  // 目标位置
  const targetPos = React.useRef({ x: -180, y: 340 }).current;

  // 箭头位置(相对于中心点)
  const pinPos = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // 箭头大小
  const pinSize = React.useRef({ width: 0, height: 0 }).current;

  // 各种状态数
  const status = React.useRef({ 
    // 记录上一次移动结束的坐标
    prevX: 0, prevY: 0, 
    // 记录最近位置发生变化的坐标
    lastX: -1, lastY: -1,
    // 记录最近一次中心点瓦片ID
    gridId: 0,
    // 阻尼动画
    decayAnimation: null,
    // 重置坐标(该坐标不处理位置响应，防止嵌套调用)
    resetXY: null,
  }).current;

  // 记录触摸状态
  const isTouchStart = React.useRef(false);

  // 箭头布局处理器
  const pinOnLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    pinSize.width = width;
    pinSize.height = height;
  }

  const onLocationPinChanged = (x, y) => {
    const distX = x - targetPos.x;
    const distY = y - targetPos.y;

    if (Math.abs(distX) > (WIN_SIZE.width / 2) || Math.abs(distY) > (WIN_SIZE.height / 2)) {
      const direction = (distX > 0) ? 1 : -1;
      const pinOffsetY = (y - targetPos.y) * ((x - targetPos.x) - WIN_SIZE.width / 2) / (x - targetPos.x); // 梯形中间高度
      if (pinOffsetY > 0) {
        const limitOffsetY = (WIN_SIZE.height / 2) - (pinSize.height);
        pinPos.setValue({ x: (direction * (WIN_SIZE.width / 2)) - (direction * px2pd(pinSize.width)), y: (pinOffsetY > limitOffsetY) ? limitOffsetY : pinOffsetY });
      } else if (pinOffsetY < 0) {
        const limitOffsetY = (WIN_SIZE.height / 2) - (pinSize.height) - statusBarHeight; // 顶部区域不可点击
        pinPos.setValue({ x: (direction * (WIN_SIZE.width / 2)) - (direction * px2pd(pinSize.width)), y: (Math.abs(pinOffsetY) > limitOffsetY) ? -limitOffsetY : pinOffsetY });
      }
    } else {
      pinPos.setValue({ x: WIN_SIZE.width * 2, y: WIN_SIZE.height * 2 }); // 放在角落不可视
    }
  }

  // 地图坐标发生改变
  const onMapPositionChanged = ({ x, y }) => {
    if (status.lastX == x && status.lastY == y)
      return;

    // 位置箭头改变
    onLocationPinChanged(x, y);

    // 计算出与方向箭头的角度
    const angle = Math.atan2((x - pinPos.x._value - targetPos.x), (y - pinPos.y._value - targetPos.y)) * (180 / Math.PI);
    refLocationPin.current.setSpinValue(angle);

    // 越界检测
    if ((y <= OFFSET_Y_BOTTOM_LIMIT) || (x >= OFFSET_X_LEFT_LIMIT) || (y >= OFFSET_Y_TOP_LIMIT) || (x <= OFFSET_X_RIGHT_LIMIT)) {
      stopDecayAnimation();

      if (status.resetXY == null) {
        let resetX = x;
        let resetY = y;
        if (x >= OFFSET_X_LEFT_LIMIT) {
          resetX = OFFSET_X_LEFT_LIMIT;
        } else if (x <= OFFSET_X_RIGHT_LIMIT) {
          resetX = OFFSET_X_RIGHT_LIMIT;
        }
        if (y <= OFFSET_Y_BOTTOM_LIMIT) {
          resetY = OFFSET_Y_BOTTOM_LIMIT;
        } else if (y >= OFFSET_Y_TOP_LIMIT) {
          resetY = OFFSET_Y_TOP_LIMIT;
        }
        status.resetXY = { x: resetX, y: resetY };
        mapPos.setValue(status.resetXY);
      }
      return;
    }

    status.lastX = x;
    status.lastY = y;

    const diffX = mapInitXY.x - x; // 距离出生点偏移量X
    const diffY = mapInitXY.y - y; // 距离出生点偏移量Y
    const diffColumns = Math.floor(diffX / MAP_GRID_WIDTH); // 距离出生点偏移列数
    const diffRows = Math.floor(diffY / MAP_GRID_HEIGHT); // 距离出生点偏离行数
    const gridId = (MAP_COLUMNS * ((MAP_ROWS / 2) + (diffRows - 1))) + ((MAP_COLUMNS / 2) + diffColumns); // 中心点瓦片ID

    // 中心点瓦片不放生变化直接返回
    if (status.gridId == gridId)
      return;

    status.gridId = gridId;

    // 更新可视区域瓦片
    setGrids((list) => {
      const boundGridIds = generateGridBound(gridId);
      const newGrids = [];

      lo.forEach(boundGridIds, (item) => {
        const found = lo.find(list, (v) => (parseInt(v.key) == item.gridId));
        if (found == undefined) {
          const grid = (<Grid key={item.gridId} gridId={item.gridId} style={[
            { left: OFFSET_X + ((diffColumns - item.x) * MAP_GRID_WIDTH), top: OFFSET_Y + ((diffRows - item.y) * MAP_GRID_HEIGHT) }
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

  // move 完毕后执行
  const onMoveEnd = () => {
    status.prevX = mapPos.x._value;
    status.prevY = mapPos.y._value;
  }

  // 直接移动到指定坐标
  const moveTo = (x, y, duration = 0) => {
    // 越界检测
    if ((y <= OFFSET_Y_BOTTOM_LIMIT)
      || (x >= OFFSET_X_LEFT_LIMIT)
      || (y >= OFFSET_Y_TOP_LIMIT)
      || (x <= OFFSET_X_RIGHT_LIMIT)
      )
      return

    // console.debug('moveTo => ', x, y);

    if (duration > 0) {
      Animated.timing(mapPos, {
        toValue: { x, y },
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onMoveEnd();
        }
      });
    } else {
      mapPos.setValue({ x, y });
    }
  }

  // dx,dy: 从按下后移动距离
  // duration: 大于0则动画移动
  const move = (dx, dy, duration = 0) => {
    const x = status.prevX + dx;
    const y = status.prevY + dy;
    moveTo(x, y, duration);
  }

  // 停止阻尼动画
  const stopDecayAnimation = () => {
    if (status.decayAnimation != null) {
      status.decayAnimation.stop();
      status.decayAnimation = null;
      onMoveEnd();
      return true;
    }
    return false;
  }

  // 拖拽处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => {
      // 按钮按下时不相应手势
      return !dataContext.pressIn;
    },
    onPanResponderGrant: (evt, gestureState) => {
      // 阻尼动画如果未完成，强制终止
      if (stopDecayAnimation()) {
        isTouchStart.current = false;
      }
      status.resetXY = null;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx != 0 || gestureState.dy != 0) {
        // 单指操作
        if (gestureState.numberActiveTouches === 1) {
          move(gestureState.dx, gestureState.dy);
        }

        // 中断触摸点击
        isTouchStart.current = false;
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.vx != 0 || gestureState.vy != 0) {
        const animation = Animated.decay(mapPos, {
          deceleration: 0.998,
          velocity: { x: gestureState.vx, y: gestureState.vy },
          useNativeDriver: true,
        });
        animation.start(({ finished }) => {
          if (finished) {
            status.decayAnimation = null;
            onMoveEnd();
          }
        });
        status.decayAnimation = animation;
      } else {
        onMoveEnd();
      }
    },
  })).current;

  // 开始点击
  const touchStartHandler = (e) => {
    // 如果按钮被按下，优先处理按钮，忽略触摸点击。
    isTouchStart.current = (!dataContext.pressIn);
  }

  // 结束点击
  const touchEndHandler = (e) => {
    // 如果触摸被手势中断，优先处理手势，忽略触摸点击。
    if (!isTouchStart.current)
      return;

    // 停止存在的阻尼动画
    if (stopDecayAnimation())
      return;

    const { pageX, pageY } = e.nativeEvent;
    const winSize = getWindowSize();
    const dx = (winSize.width / 2) - pageX;
    const dy = (winSize.height / 2) - pageY;

    move(dx, dy, 300);
    isTouchStart.current = false;
  }

  React.useEffect(() => {
    const key = mapPos.addListener(onMapPositionChanged);
    move(0, 0);
    return () => {
      mapPos.removeListener(key);
    }
  }, []);

  // 渲染地图对象层
  React.useEffect(()  => {
    const map_data = window.TileMaps.world_map;
    if (map_data != undefined) {
      const newObjects = [];
      lo.forEach(map_data.layers, (item) => {
        if (!lo.isEqual(item.type, 'objectgroup') || !item.visible)
          return;
        
        lo.forEach(item.objects, (e) => {
          const { id } = e;
          newObjects.push(<MapObject key={id} data={e} onClose={props.onClose} />);
        });
      });
      setObjects(newObjects);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#333' }} {...panResponder.panHandlers} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler}>
      {/* 瓦片集合 */}
      <Animated.View style={{ flex: 1, transform: [{ translateX: mapPos.x }, { translateY: mapPos.y }] }} pointerEvents={'none'}>
        {grids}
      </Animated.View>

      {/* 地图对象 */}
      <Animated.View style={{ position: 'absolute', transform: [{ translateX: mapPos.x }, { translateY: mapPos.y }] }} pointerEvents={'box-none'}>
        {objects}
      </Animated.View>

      {/* 角色 */}
      <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} pointerEvents={'none'}>
        <FastImage source={require('../../../assets/bg/explore_person.png')} style={{ width: px2pd(185), height: px2pd(166) }} />
      </View>

      {/* 位置指针 */}
      <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} pointerEvents={'box-none'}>
        <Animated.View style={{ transform: [{ translateX: pinPos.x }, { translateY: pinPos.y }] }} onLayout={pinOnLayout}>
          <LocationPinWrapper ref={refLocationPin} onPress={() => { moveTo(targetPos.x, targetPos.y, 600); }} />
        </Animated.View>
      </View>

      {/* 大地图关闭按钮 */}
      <View style={{ position: 'absolute', right: px2pd(50), top: px2pd(150) }} onTouchStart={() => {
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

export class WorldMapUtils {
  static show() {
    const key = RootView.add(<WorldMap onClose={() => {
      RootView.remove(key);
    }} />);
  }
}

export default WorldMap;
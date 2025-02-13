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
import { action, connect, getPropIcon, EventKeys, getTurnLatticeBg } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import Toast from '../../toast';
import { ArticleOptionActions } from '../../article';
import { confirm } from '../../dialog';

import FastImage from 'react-native-fast-image';
import { ImageButton, ReturnButton, TextButton } from '../../../constants/custom-ui';
import RootView from '../../RootView';
import PopComponent from './PopComponent';
import Grid from './Grid';

const TurnLattice = props => {
  const {
    onClose,
    turnLatticeData,
    currentLayer,
    __sceneId,
    latticeMazeId = '航海探索',
    isReload = true
  } = props;

  const [pop, setPop] = useState(<></>);

  const [gridConfig, setGridConfig] = useState([]);
  const row = turnLatticeData[currentLayer]?.row || 0;
  const column = turnLatticeData[currentLayer]?.row || 0;
  const img = turnLatticeData[currentLayer]?.img || 0;
  const layerTitle = turnLatticeData[currentLayer]?.desc || ""

  const _height = 50 * column
  const _width = 50 * row

  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isTouchStart = useRef(true);
  const [isRefresh, setIsRefresh] = useState(false)

  const status = useRef({
    // 记录双指触发的起始坐标
    twoFingersStart: [],
  }).current;

  useEffect(() => {
    props
      .dispatch(action('TurnLatticeModel/getTurnLatticeData')({ latticeMazeId, isReload, }))
      .then(result => {
        if (result !== undefined) {
          if (isReload) {
            setPop(
              <View style={styles.popContainer}>
                <PopComponent
                  title={latticeMazeId}
                  desc={result.desc}
                  message={result.message}
                  confirm={() => {
                    props.dispatch(action('TurnLatticeModel/consumableProps')());
                    setPop(<></>);
                  }}
                  onClose={onClose}
                />
              </View>,
            );
          }
          setGridConfig([...result.latticeConfig]);
        }
      });

    const closeTurnLatticeEvent = DeviceEventEmitter.addListener(
      EventKeys.CLOSE_TURN_LATTICE_EVENT,
      () => {
        onClose();
      },
    );
    const refreshEvent = DeviceEventEmitter.addListener(
      "TURN_LATTICE_REFRESH",
      () => {
        setIsRefresh(!isRefresh);
      },
    );
    return () => {
      closeTurnLatticeEvent.remove();
      refreshEvent.remove()
    };
  }, []);

  // 翻开格子
  const openGrid = item => {
    props.dispatch(action('TurnLatticeModel/openGrid')({ item })).then(result => {
      if (result !== undefined) {
        setGridConfig([...result]);
      }
    });
  };

  // 触发事件
  const handlerGridEvent = (item) => {
    props.dispatch(action('TurnLatticeModel/triggerGridEvent')({ item })).then(result => {
      if (result !== undefined) {
        setGridConfig([...result]);
      }
    });
  }

  // 渲染格子
  const RenderItem = ({ item, index }) => {
    return (
      <Grid
        {...props}
        setGridConfig={setGridConfig}
        openGrid={() => openGrid(item)}
        handlerGridEvent={handlerGridEvent}
        item={item}
        index={index}
        isTouchStart={isTouchStart}
        onClose={onClose}
      />
    );
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        return isTouchStart.current;
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        }
        if (gestureState.numberActiveTouches === 2) {
          status.twoFingersStart = evt.nativeEvent.touches;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx != 0 || gestureState.dy != 0) {
          // 单指操作
          if (gestureState.numberActiveTouches === 1) {
            Animated.timing(pan, {
              toValue: { x: gestureState.dx, y: gestureState.dy },
              duration: 0,
              useNativeDriver: false,
            }).start();
          }
          // 双指操作
          if (gestureState.numberActiveTouches === 2) {
            const scale = getScale(
              status.twoFingersStart,
              evt.nativeEvent.touches,
            );
            if (scale < 1.5 && scale > 0.5) {
              Animated.timing(scaleAnim, {
                toValue: scale,
                duration: 0,
                useNativeDriver: false,
              }).start();
            }
          }
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.viewContainer}>
      <FastImage source={require('../../../../assets/games/turnLattice/bg.png')} style={{ position: 'absolute', width: '100%', height: "100%" }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              height: _height + 30,
              width: _width + 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(60,60,60,0.6)",
              borderWidth: 2,
              borderColor: "rgba(62,62,62,0.6)",
              transform: [
                { scale: scaleAnim },
                { translateX: pan.x },
                { translateY: pan.y },
              ],
            }}>
            <View style={{ position: 'absolute', top: -50, left: 0, zIndex: 5 }}>
              <Text style={{ fontSize: 20, color: "#fff" }}>{layerTitle}</Text>
            </View>
            <View style={{
              width: _width + 20,
              height: _height + 20,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 4,
              borderColor: "rgba(101,101,101,0.6)",
            }}>
              <View style={{
                borderWidth: 2,
                borderColor: "666666"
              }}>
                <View style={{
                  height: _height,
                  width: _width,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      opacity: gridConfig.length === 0 ? 0 : 1,
                    }}
                    source={getTurnLatticeBg(img)}
                  />
                  {gridConfig.length !== 0 ? (
                    gridConfig.map((item, index) => (
                      <RenderItem key={index} item={item} />
                    ))
                  ) : (
                    <></>
                  )}
                </View>
              </View>
            </View>

          </Animated.View>
        </View>
        <View style={{ width: px2pd(172), marginBottom: 12 }}>
          <ReturnButton onPress={onClose} />
        </View>
      </SafeAreaView>
      {pop}
    </View>
  );
};

export default connect(state => ({ ...state.TurnLatticeModel }))(TurnLattice);

// 手指移动距离
function getDistance(start, stop) {
  return Math.sqrt(
    Math.pow(stop.pageX - start.pageX, 2) +
    Math.pow(stop.pageY - start.pageY, 2),
  );
}

// 缩放大小
function getScale(start, stop) {
  return getDistance(stop[0], stop[1]) / getDistance(start[0], start[1]);
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
  popContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});

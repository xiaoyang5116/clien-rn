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
  PanResponder
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

import qualityStyle from '../../../themes/qualityStyle';
import { action, connect, getPropIcon, EventKeys } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import Toast from '../../toast';
import { ArticleOptionActions } from '../../article';

import FastImage from 'react-native-fast-image';
import { TextButton } from '../../../constants/custom-ui';

// status: 0-不可翻开 || 1-可翻开 || 2-已翻开
// type: "入口" || "出口" || "道具" || "空" || "墙"

// 不可翻开状态
const Grid_0 = ({ isOpened }) => {
  return (
    <View
      style={[
        styles.gridContainer,
        { backgroundColor: '#0E64FF', opacity: isOpened ? 0.7 : 1 },
      ]}
    />
  );
};

// 可翻开状态
const Grid_1 = ({ item, openGrid, isTouchStart }) => {
  return (
    <TouchableHighlight
      onPressIn={() => { isTouchStart.current = false }}
      onPressOut={() => { isTouchStart.current = true }}
      onPress={openGrid}>
      <View
        style={[
          styles.gridContainer,
          { backgroundColor: '#F76363', opacity: 0.7 },
        ]}
      />
    </TouchableHighlight>
  );
};

// 已翻开状态
const Grid_2 = props => {
  return <View style={[styles.gridContainer]} />;
};

// 入口格子
const Grid_Entrance = props => {
  return (
    <View
      style={[styles.gridContainer, { backgroundColor: '#09D0D2', opacity: 0.9 }]}
    />
  );
};

// 出口格子
const Grid_Export = ({ item, openGrid, exportHandler, isTouchStart }) => {
  if (item.status === 0) {
    return <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} isTouchStart={isTouchStart} />;
  }
  if (item.status === 2) {
    return (
      <TouchableOpacity
        onPressIn={() => { isTouchStart.current = false }}
        onPressOut={() => { isTouchStart.current = true }}
        onPress={exportHandler}>
        <View
          style={[
            styles.gridContainer,
            { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
          ]}>
          <Grid_2 />
        </View>

      </TouchableOpacity>
    );
  }
  return <Grid_0 isOpened={item.isOpened} />;
};

// 墙格子
const Grid_Wall = props => {
  return <View style={[styles.gridContainer, { backgroundColor: '#0E64FF' }]} />;
};

// 空格子
const Grid_Empty = ({ item, openGrid, isTouchStart }) => {
  if (item.status === 0) {
    return <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} isTouchStart={isTouchStart} />;
  }
  if (item.status === 2) {
    return <Grid_2 />;
  }
  return <Grid_0 />;
};

// 道具格子
const Grid_Prop = ({ item, openGrid, getGridProps, isTouchStart }) => {
  const { prop } = item;
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(prop.quality),
  );
  const image = getPropIcon(prop.iconId);

  let status = <></>;
  if (item.status === 0) {
    status = <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    status = <Grid_1 openGrid={openGrid} isTouchStart={isTouchStart} />;
  }

  if (item.status === 2) {
    return (
      <TouchableOpacity
        onPressIn={() => { isTouchStart.current = false }}
        onPressOut={() => { isTouchStart.current = true }}
        onPress={getGridProps}>
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
              borderRadius: 5,
              borderWidth: 1,
              borderColor: quality_style.borderColor,
              backgroundColor: quality_style.backgroundColor,
            }}
            source={image.img}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
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
          borderRadius: 5,
          borderWidth: 1,
          borderColor: quality_style.borderColor,
          backgroundColor: quality_style.backgroundColor,
        }}
        source={image.img}
      />
      {status}
    </View>
  );
};

// 事件格子
const Grid_Event = ({ item, openGrid, eventHandler, isTouchStart }) => {
  if (item.status === 0) {
    return <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} isTouchStart={isTouchStart} />;
  }
  if (item.status === 2) {
    return (
      <TouchableOpacity
        onPressIn={() => { isTouchStart.current = false }}
        onPressOut={() => { isTouchStart.current = true }}
        onPress={eventHandler}>
        <View
          style={[
            styles.gridContainer,
            { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E1C60E' },
          ]}>
        </View>
      </TouchableOpacity>
    )
  }
  return <Grid_0 />;
}



const TurnLattice = props => {
  const { onClose, turnLatticeData, currentLayer, __sceneId } = props;

  const [gridConfig, setGridConfig] = useState([]);
  const row = turnLatticeData[currentLayer]?.row || 0;
  const column = turnLatticeData[currentLayer]?.row || 0;

  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(new Animated.Value(1)).current
  const isTouchStart = useRef(true)

  const status = useRef({
    // 记录双指触发的起始坐标
    twoFingersStart: [],
  }).current

  useEffect(() => {
    props
      .dispatch(action('TurnLatticeModel/getTurnLatticeData')())
      .then(result => {
        if (result !== undefined) {
          setGridConfig([...result]);
        }
      });

    const closeTurnLatticeEvent = DeviceEventEmitter.addListener(EventKeys.CLOSE_TURN_LATTICE_EVENT, () => {
      onClose()
    })
    return () => {
      closeTurnLatticeEvent.remove();
    }
  }, []);

  // 翻开格子
  const openGrid = item => {
    props.dispatch(action('TurnLatticeModel/openGrid')({ item })).then(result => {
      if (result !== undefined) {
        setGridConfig([...result]);
      }
    });
  };

  // 领取道具
  const getGridProps = item => {
    props
      .dispatch(action('TurnLatticeModel/getGridProps')({ item }))
      .then(result => {
        if (result !== undefined) {
          setGridConfig([...result]);
        }
      });
  };

  // 出口
  const exportHandler = () => {
    props
      .dispatch(action('TurnLatticeModel/exportGrid')())
      .then(result => {
        if (result !== undefined && result != null) {
          setGridConfig([...result]);
        } else {
          onClose()
        }
      });
  };

  // 事件
  const eventHandler = (item) => {
    if (item.action.toChapter !== undefined || item.action.toScene !== undefined) {
      onClose()
      ArticleOptionActions.invoke({ __sceneId, ...item.action });
    }

    if (item.action.dialogs !== undefined && item.action.sceneId !== undefined) {
      ArticleOptionActions.invoke({ __sceneId: item.action.sceneId, ...item.action });
    }
  }

  // 渲染格子
  const RenderItem = ({ item, index }) => {
    if (item.type === '入口') return <Grid_Entrance item={item} />;
    if (item.type === '出口') {
      return (
        <Grid_Export
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          isTouchStart={isTouchStart}
          exportHandler={exportHandler}
        />
      );
    }
    if (item.type === '道具') {
      return (
        <Grid_Prop
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          isTouchStart={isTouchStart}
          getGridProps={() => {
            getGridProps(item);
          }}
        />
      );
    }
    if (item.type === "事件") {
      return (
        <Grid_Event
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          isTouchStart={isTouchStart}
          eventHandler={() => {
            eventHandler(item)
          }}
        />
      )
    }

    if (item.type === '空') {
      return (
        <Grid_Empty
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          isTouchStart={isTouchStart}
        />
      );
    }

    if (item.type === '墙') return <Grid_Wall item={item} />;

    return (
      <Grid_Empty
        item={item}
        openGrid={() => {
          openGrid(item);
        }}
        isTouchStart={isTouchStart}
      />
    );
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        return isTouchStart.current
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
          });
        }
        if (gestureState.numberActiveTouches === 2) {
          status.twoFingersStart = evt.nativeEvent.touches
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
            }).start()
          }
          // 双指操作
          if (gestureState.numberActiveTouches === 2) {
            const scale = getScale(status.twoFingersStart, evt.nativeEvent.touches)
            if (scale < 1.5 && scale > 0.5) {
              Animated.timing(scaleAnim, {
                toValue: scale,
                duration: 0,
                useNativeDriver: false,
              }).start()
            }
          }
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              height: 50 * column,
              width: 50 * row,
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              transform: [
                { scale: scaleAnim },
                { translateX: pan.x },
                { translateY: pan.y }
              ],
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: gridConfig.length === 0 ? 0 : 1,
              }}
              source={require('../../../../assets/bg/baojian.png')}
            />
            {gridConfig.length !== 0 ? (
              gridConfig.map((item, index) => <RenderItem key={index} item={item} />)
            ) : (
              <></>
            )}

          </Animated.View>
        </View>
        <TextButton title="退出" onPress={onClose} style={{ marginTop: 20 }} />
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.TurnLatticeModel }))(TurnLattice);


function getDistance(start, stop) {
  return Math.sqrt(Math.pow((stop.pageX - start.pageX), 2) + Math.pow((stop.pageY - start.pageY), 2));
}

function getScale(start, stop) {
  return getDistance(stop[0], stop[1]) / getDistance(start[0], start[1]);
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});

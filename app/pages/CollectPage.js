
import React from 'react';

import lo from 'lodash';

import {
  StyleSheet,
  connect,
  action,
  AppDispath,
} from "../constants";

import {
  View,
  Text,
  TouchableWithoutFeedback,
} from '../constants/native-ui';

import { 
  Animated, 
  DeviceEventEmitter, 
  Image,
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { ImageButton } from '../constants/custom-ui';
import { getFixedWidthScale, px2pd } from '../constants/resolution';
import FastImage from 'react-native-fast-image';
import SpriteSheet from '../components/SpriteSheet';
import RootView from '../components/RootView';
import Toast from '../components/toast';
import PropGrid from '../components/prop/PropGrid';

const pxWidth = 1000; // 像素宽度
const pxHeight = 1300; // 像素高度
const pxGridWidth = 160;  // 格子像素宽度
const pxGridHeight = 160; // 格子像素高度

const SCENE_ITEMS = [
  { id: 1, source: require('../../assets/collect/item_1.png') },
  { id: 2, source: require('../../assets/collect/item_2.png') },
  { id: 3, source: require('../../assets/collect/item_3.png') },
  { id: 4, source: require('../../assets/collect/item_4.png') },
  { id: 5, source: require('../../assets/collect/item_5.png') },
  { id: 6, source: require('../../assets/collect/item_6.png') },
  { id: 7, source: require('../../assets/collect/item_7.png') },
];

const BACKGROUNDS = [
  { name: 'collect_default', source: require('../../assets/bg/collect_default.png') },
];

const EFFECTS = [
  { effectId: 1, columns: 8, rows: 6, framesNum: 48, source: require('../../assets/animations/flower_effect_1.png') },
  { effectId: 2, columns: 6, rows: 5, framesNum: 27, source: require('../../assets/animations/flower_effect_2.png') },
  { effectId: 3, columns: 9, rows: 5, framesNum: 44, source: require('../../assets/animations/flower_effect_3.png') },
];

const MOV_SPEED = 1000; // 物品飞入速度
const BAG_POSITION = { x: 300, y: 430 };
const PROGRESS_WIDTH = 60;

const AnimatedTarget = (props) => {

  const opacity = React.useRef(new Animated.Value(1)).current;
  const translateXY = React.useRef(new Animated.ValueXY({ x: props.left, y: props.top })).current;


  const a = Math.abs(BAG_POSITION.y - props.top);
  const b = Math.abs(BAG_POSITION.x - props.left);
  const c = Math.sqrt(a * a + b * b);
  const t = (c / MOV_SPEED) * 1000;

  React.useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(translateXY, {
          toValue: BAG_POSITION,
          duration: t,
          useNativeDriver: false,
        })
      ]),
      Animated.sequence([
        Animated.delay(t * 0.6),
        Animated.timing(opacity, {
          toValue: 0, 
          duration: t * 0.4,
          useNativeDriver: false,
        })
      ]),
    ]).start((r) => {
      const { finished } = r;
      if (finished) {
        DeviceEventEmitter.emit('___@CollectPage.moveCompleted', { ...props });
      }
    });
  }, []);

  const item = SCENE_ITEMS.find(e => e.id == props.itemId);

  return (
    <Animated.Image 
      style={[{ position: 'absolute', width: px2pd(pxGridWidth), height: px2pd(pxGridHeight) }, 
      { transform: [{ translateX: translateXY.x }, { translateY: translateXY.y }] },
      { opacity: opacity } ]} 
      source={item.source} 
    />
  )
}

const AnimationLayer = (props) => {

  const uniqueKey = React.useRef(0);
  const [ targets, setTargets ] = React.useState([]);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.touchOne', (e) => {
      // 隐藏格子
      DeviceEventEmitter.emit('___@CollectPage.hideGrid', { ...e });

      // 显示动画对象
      setTargets((targets) => {
        const target = <AnimatedTarget key={uniqueKey.current++} left={e.left} top={e.top} itemId={e.itemId} collectId={props.collectId} />;
        return [...targets, target];
      });
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.touchAll', () => {
      AppDispath({ type: 'CollectModel/getVisableGrids', payload: { collectId: props.collectId }, cb: (list) => {
        const grids = [...list];
        const timer = setInterval(() => {
          if (grids.length > 0) {
            const item = grids.shift();
            if (item.time <= 0) {
              DeviceEventEmitter.emit('___@CollectPage.touchOne', { ...item });
            } else {
              DeviceEventEmitter.emit('___@CollectPage.showProgress', { ...item });
            }
          } else {
            clearInterval(timer);
          }
        }, 60);
      } });
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }} pointerEvents='none'>
      {targets}
    </View>
  )
}

const CollectProgress = (props) => {
  const [seconds, setSeconds] = React.useState(props.time);

  const timeOutHandler = () => {
    DeviceEventEmitter.emit('___@CollectPage.touchOne', { ...props });
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((sec) => {
        if (sec <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            timeOutHandler();
          }, 0);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
  }, []);

  const percent = seconds / props.time;
  const value = percent * PROGRESS_WIDTH;
  const translateX = PROGRESS_WIDTH - value;

  return (
    <View style={[styles.progressView]}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.progressBar, { transform: [{ translateX: translateX }] }]} />
        <Text>{(100 - Math.floor(percent * 100))}%</Text>
      </View>
    </View>
  );
}

const GridItem = (props) => {

  const sheet = React.createRef(null);
  const opacity = React.useRef(new Animated.Value(1));
  const [pointerEvents, setPointerEvents] = React.useState('auto');
  const [progress, setProgress] = React.useState(null);

  const item = SCENE_ITEMS.find(e => e.id == props.itemId);
  const effect = EFFECTS.find(e => e.effectId === props.effectId);

  React.useEffect(() => {
    //
    const play = type => {
      sheet.current.play({
        type,
        fps: Number(18),
        resetAfterFinish: false,
        loop: true,
      });
    };
    play('walk');
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.hideGrid', (e) => {
      const { id } = e;
      if (id == props.id) {
        //
        Animated.timing(opacity.current, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
        //
        setPointerEvents('none');
        AppDispath({ type: 'CollectModel/hideGrid', payload: { ...e } });
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.showProgress', (e) => {
      const { id } = e;
      if ((id == props.id) && props.show) {
        setProgress((p) => {
          if (p == null)
            return <CollectProgress { ...props } />;
          else
            return p;
        });
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <Animated.View 
      style={{ 
        position: 'absolute',
        width: px2pd(pxGridWidth), height: px2pd(pxGridHeight), 
        top: props.top, left: props.left,
        opacity: opacity.current,
      }}
      onTouchStart={(e) => {
        if (!props.show) 
          return;
        if (props.time <= 0) {
          // 不需要倒计时，直接领取
          DeviceEventEmitter.emit('___@CollectPage.touchOne', { ...props });
        } else {
          // 显示时间进度条
          setProgress(<CollectProgress { ...props } />);
        }
      }} 
      pointerEvents={pointerEvents}
    >
      <FastImage 
        style={{ position: 'absolute', width: px2pd(pxGridWidth), height: px2pd(pxGridHeight), transform: [{ scale: lo.random(0.75, 1) }] }} 
        source={item.source} 
      />
      <SpriteSheet
        ref={ref => (sheet.current = ref)}
        source={effect.source}
        columns={effect.columns}
        rows={effect.rows}
        frameWidth={200}
        frameHeight={200}
        imageStyle={{}}
        viewStyle={{ left: -74, top: -74, transform: [{ scale: getFixedWidthScale() }] }}
        animations={{
          walk: lo.range(effect.framesNum),
        }}
      />
      {progress}
    </Animated.View>
  );
}

// 袋子物品
const BagItem = (props) => {
  return (
  <View style={{ flexDirection: 'column', margin: 8, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
    <PropGrid prop={props} labelStyle={{ color: '#000' }} />
  </View>
  );
}

// 储物袋页面
const BagPage = (props) => {
  const childs = [];
  let key = 0;
  props.data.forEach(e => {
      childs.push(<BagItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} quality={e.quality} />);
  });
  return (
      <TouchableWithoutFeedback onPress={() => { props.onClose() }}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
              <View>
                  <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得奖励</Text>
              </View>
              <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                  <FastImage style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../assets/bg/dialog_line.png')} />
                  {childs}
                  <FastImage style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../assets/bg/dialog_line.png')} />
              </View>
              <View>
                  <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
              </View>
          </View>
      </TouchableWithoutFeedback>
  );
}

const BagButton = (props) => {
  const emptyImage = require('../../assets/button/collect_bag1.png');
  const notEmptyImage = require('../../assets/button/collect_bag2.png');
  const defaultImage = (lo.isArray(props.bags[0]) && props.bags[0].length > 0)
    ? notEmptyImage : emptyImage;

  const [buttonImage, setButtonImage] = React.useState(defaultImage);
  const scale = React.useRef(new Animated.Value(1));

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.touchAll', ({ collectId }) => {
      if (!lo.isEqual(collectId, props.collectId)) return;
      setTimeout(() => {
        setButtonImage(notEmptyImage);
      }, 300);
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.moveCompleted', ({ collectId }) => {
      if (!lo.isEqual(collectId, props.collectId)) return;
      // 更换袋子按钮图片
      setTimeout(() => {
        setButtonImage(notEmptyImage);
      }, 0);
      // 播放按钮动效
      Animated.sequence([
        Animated.timing(scale.current, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scale.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        })
      ]).start();
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener('___@CollectPage.getBagItems', ({ collectId }) => {
      if (!lo.isEqual(collectId, props.collectId)) return;
      setTimeout(() => {
        setButtonImage(emptyImage);
      }, 0);
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => {
        props.dispatch(action('CollectModel/getBagItems')({ collectId: props.collectId }))
        .then(list => {
          if (lo.isEmpty(list)) {
            Toast.show('储物袋为空');
            return;
          }
          const key = RootView.add(<BagPage data={list} onClose={() => {
            RootView.remove(key);
          }} />);
          DeviceEventEmitter.emit('___@CollectPage.getBagItems', { collectId: props.collectId });
        });
      }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Image style={{ width: px2pd(210), height: px2pd(210), transform: [{ scale: scale.current }] }} source={buttonImage} />
        <FastImage style={{ position: 'absolute', bottom: -18, right: 10, width: px2pd(232), height: px2pd(88) }} source={require('../../assets/button/collect_bag_button.png')} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const CollectPage = (props) => {
  
  const [grids, setGrids] = React.useState([]);

  React.useEffect(() => {
    props.dispatch(action('CollectModel/getGridData')({ collectId: props.collectId }))
    .then(list => {
      const array = [];
      list.forEach(g => {
        if (!g.show) return;
        array.push(<GridItem key={g.id} {...g} collectId={props.collectId} />);
      });
      setGrids(array);
    });
  }, []);

  const collectAll = () => {
    DeviceEventEmitter.emit('___@CollectPage.touchAll', { collectId: props.collectId });
  }

  const config = props.__data.collects.find(e => lo.isEqual(e.id, props.collectId));

  return (
    <View style={styles.viewContainer}>
      <FastImage style={{ position: 'absolute', zIndex: -10, width: px2pd(1080), height: px2pd(1708) }} source={require('../../assets/bg/collect_border_bg.jpg')} />
      <View style={styles.bodyContainer}>
        <View style={styles.topBarContainer}>
          <TouchableWithoutFeedback onPress={() => {
              if (props.onClose != undefined) {
                props.onClose();
              }
            }}>
            <AntDesign name={'left'} size={30} />
          </TouchableWithoutFeedback>
        </View>
        <FastImage style={{ width: px2pd(1020), height: px2pd(1320), overflow: 'visible' }} source={BACKGROUNDS.find(e => lo.isEqual(e.name, config.background)).source}>
          <View style={styles.mapContainer}>
            {grids}
            <AnimationLayer collectId={props.collectId} />
          </View>
        </FastImage>
      </View>
      <View style={{ position: 'absolute', bottom: 50, width: '100%', zIndex: -1, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
        <ImageButton 
          width={px2pd(624)} 
          height={px2pd(130)} 
          source={require('../../assets/button/collect_all_button.png')}
          selectedSource={require('../../assets/button/collect_all_button.png')}
          onPress={collectAll}
        />
      </View>
      <View style={{ width: '100%', zIndex: 2, marginTop: 0, marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
        <View style={{ position: 'absolute', top: -35, right: -10, justifyContent: 'center', alignItems: 'center' }}>
          <BagButton {...props} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#64615e',
    justifyContent: 'center', 
    alignItems: 'center',
  },

  bodyContainer: {
  },

  topBarContainer: {
    position: 'absolute',
    top: -32,
    zIndex: 1,
  },

  mapContainer: {
    width: px2pd(pxWidth),
    height: px2pd(pxHeight),
  },

  progressView: {
    position: 'absolute', 
    left: 0, 
    bottom: -12, 
    width: PROGRESS_WIDTH, 
    height: 18, 
    borderWidth: 1, 
    borderColor: '#fff', 
    borderRadius: 5, 
    backgroundColor: '#999',
    overflow: 'hidden',
  },

  progressBar: {
    position: 'absolute', 
    left: -PROGRESS_WIDTH, 
    width: PROGRESS_WIDTH, 
    height: 18, 
    backgroundColor: '#eee',
  },
});

export default connect((state) => ({ ...state.CollectModel }))(CollectPage);
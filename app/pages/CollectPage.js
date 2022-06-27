
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
  TouchableWithoutFeedback,
} from '../constants/native-ui';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextButton } from '../constants/custom-ui';
import { getFixedWidthScale, px2pd } from '../constants/resolution';
import FastImage from 'react-native-fast-image';
import SpriteSheet from '../components/SpriteSheet';
import { Animated, DeviceEventEmitter } from 'react-native';

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

const AnimatedTarget = (props) => {

  const opacity = React.useRef(new Animated.Value(1)).current;
  const translateXY = React.useRef(new Animated.ValueXY({ x: props.left, y: props.top })).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(translateXY, {
          toValue: { x: 300, y: 500 },
          duration: 800,
          useNativeDriver: false,
        })
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(opacity, {
          toValue: 0, 
          duration: 200,
          useNativeDriver: false,
        })
      ]),
    ]).start();
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
      setTargets((targets) => {
        const target = <AnimatedTarget key={uniqueKey.current++} left={e.left} top={e.top} itemId={e.itemId} />;
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
            DeviceEventEmitter.emit('___@CollectPage.hideGrid', { ...item });
            DeviceEventEmitter.emit('___@CollectPage.touchOne', { ...item });
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

const GridItem = (props) => {

  const sheet = React.createRef(null);
  const opacity = React.useRef(new Animated.Value(1));
  const [pointerEvents, setPointerEvents] = React.useState('auto');

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

  return (
    <Animated.View 
      style={{ 
        position: 'absolute',
        width: px2pd(pxGridWidth), height: px2pd(pxGridHeight), 
        top: props.top, left: props.left,
        opacity: opacity.current,
        // backgroundColor: '#669900',
        // borderWidth: 1,
        // borderColor: '#333'
      }}
      onTouchStart={(e) => {
        if (!props.show) return;
        DeviceEventEmitter.emit('___@CollectPage.hideGrid', { id: props.id, collectId: props.collectId });

        setTimeout(() => {
          DeviceEventEmitter.emit('___@CollectPage.touchOne', { ...props });
        }, 300);
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
    </Animated.View>
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
    DeviceEventEmitter.emit('___@CollectPage.touchAll');
  }

  const config = props.__data.collects.find(e => lo.isEqual(e.id, props.collectId));

  return (
    <View style={styles.viewContainer}>
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
      <View style={{ width: '100%', zIndex: -1, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
        <TextButton title='一键采集' onPress={collectAll} />
      </View>
      <View style={{ width: '100%', zIndex: -1, marginTop: 10, marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
        <TextButton title='储物袋' />
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
    marginBottom: 5,
  },

  mapContainer: {
    width: px2pd(pxWidth),
    height: px2pd(pxHeight),
    // borderWidth: 1,
    // borderColor: '#333',
    // backgroundColor: '#666',
  },
});

export default connect((state) => ({ ...state.CollectModel }))(CollectPage);
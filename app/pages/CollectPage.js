
import React from 'react';

import lo from 'lodash';

import {
  StyleSheet,
} from "../constants";

import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from '../constants/native-ui';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextButton } from '../constants/custom-ui';
import RootView from '../components/RootView';
import { getFixedWidthScale, px2pd } from '../constants/resolution';
import FastImage from 'react-native-fast-image';
import SpriteSheet from '../components/SpriteSheet';

const pxWidth = 1000; // 像素宽度
const pxHeight = 1300; // 像素高度
const pxGridWidth = 150;  // 格子像素宽度
const pxGridHeight = 150; // 格子像素高度

const maxColumns = Math.floor(pxWidth / pxGridWidth);
const maxRows = Math.floor(pxHeight / pxGridHeight);

const EFFECTS = [
  { effectId: 2, columns: 6, rows: 5, framesNum: 27, source: require('../../assets/animations/flower_effect_2.png') },
  { effectId: 3, columns: 9, rows: 5, framesNum: 44, source: require('../../assets/animations/flower_effect_3.png') },
];

const GridItem = (props) => {

  const sheet = React.createRef(null);

  React.useEffect(() => {
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

  const effectId = lo.random(2, 3);
  const effect = EFFECTS.find(e => e.effectId === effectId);

  // 随机半径偏移量
  let randLeft = 0;
  let randTop = 0;
  if (props.i == 0) {
    randLeft = lo.random(0, 20);
  } else if (props.i == (maxColumns - 1)) {
    randLeft = lo.random(-20, 0);
  } else {
    randLeft = lo.random(-10, 10);
  }
  if (props.j == 0) {
    randTop = lo.random(0, 20);
  } else if (props.j == (maxRows - 1)) {
    randTop = lo.random(-20, 0);
  } else {
    randTop = lo.random(-10, 10);
  }

  return (
    <View style={{ 
      position: 'absolute',
      width: px2pd(pxGridWidth), height: px2pd(pxGridHeight), 
      top: (props.j * px2pd(162)) + randTop, left: (props.i * px2pd(167)) + randLeft
      }}>
      <FastImage 
        style={{ position: 'absolute', width: px2pd(pxGridWidth), height: px2pd(pxGridHeight), transform: [{ scale: lo.random(0.75, 1) }] }} 
        source={lo.random(0, 1) > 0 ? require('../../assets/collect/item_1.png') : require('../../assets/collect/item_2.png')} 
      />
      <SpriteSheet
        ref={ref => (sheet.current = ref)}
        source={effect.source}
        columns={effect.columns}
        rows={effect.rows}
        frameWidth={200}
        frameHeight={200}
        imageStyle={{ }}
        viewStyle={{ left: -74, top: -74, transform: [{ scale: getFixedWidthScale() }] }}
        animations={{
          walk: lo.range(effect.framesNum),
        }}
      />
    </View>
  );
}

const CollectPage = (props) => {

  const array = lo.range(maxColumns * maxRows);
  const hitList = [];

  for (let i = 0; i < 16; i++) {
    while (true) {
      const newArray = lo.shuffle(array);
      const hitValue = newArray[0];
      if (lo.indexOf(hitList, hitValue) == -1) {
        // 过滤：横竖三个不能连一线
        if (lo.indexOf(hitList, hitValue + 1) != -1 && lo.indexOf(hitList, hitValue + 2) != -1) continue;
        if (lo.indexOf(hitList, hitValue - 1) != -1 && lo.indexOf(hitList, hitValue + 1) != -1) continue;
        if (lo.indexOf(hitList, hitValue - 2) != -1 && lo.indexOf(hitList, hitValue - 1) != -1) continue;
        if (lo.indexOf(hitList, hitValue + maxColumns * 1) != -1 && lo.indexOf(hitList, hitValue + maxColumns * 2) != -1) continue;
        if (lo.indexOf(hitList, hitValue - maxColumns * 1) != -1 && lo.indexOf(hitList, hitValue + maxColumns * 1) != -1) continue;
        if (lo.indexOf(hitList, hitValue - maxColumns * 2) != -1 && lo.indexOf(hitList, hitValue - maxColumns * 1) != -1) continue;
        // 过滤： 四周密集度
        const a1 = lo.indexOf(hitList, hitValue - maxColumns) != -1 ? 1 : 0;
        const a2 = lo.indexOf(hitList, hitValue + maxColumns) != -1 ? 1 : 0;
        const a3 = lo.indexOf(hitList, hitValue - 1) != -1 ? 1 : 0;
        const a4 = lo.indexOf(hitList, hitValue + 1) != -1 ? 1 : 0;
        const a5 = lo.indexOf(hitList, hitValue - maxColumns - 1) != -1 ? 1 : 0;
        const a6 = lo.indexOf(hitList, hitValue - maxColumns + 1) != -1 ? 1 : 0;
        const a7 = lo.indexOf(hitList, hitValue + maxColumns - 1) != -1 ? 1 : 0;
        const a8 = lo.indexOf(hitList, hitValue + maxColumns + 1) != -1 ? 1 : 0;
        const aa = a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8;
        if (aa > 4) continue;
        //
        hitList.push(hitValue);
        break;
      }
    }
  }

  const grids = [];
  for (let i = 0; i < maxColumns; i++) {
    for (let j = 0; j < maxRows; j++) {
      const id = j * maxColumns + i;
      if (lo.indexOf(hitList, id) == -1)
        continue;

      const key = `${i}_${j}`
      grids.push(<GridItem key={key} i={i} j={j} />);
    }
  }

  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          <View style={styles.mapContainer}>
            {grids}
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
          <TextButton title='一键采集' />
        </View>
        <View style={{ width: '100%', marginTop: 10, marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
          <TextButton title='储物袋' />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#a49f99',
  },

  bodyContainer: {
  },

  topBarContainer: {
    marginBottom: 5,
  },

  mapContainer: {
    width: px2pd(pxWidth),
    height: px2pd(pxHeight),

    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#666',
  },
});

export const showCollectPage = () => {
  const key = RootView.add(<CollectPage onClose={() => {
    RootView.remove(key);
  }} />)
}

export default CollectPage;
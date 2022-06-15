
import React from 'react';

import {
  SafeAreaView,
  View,
  ImageBackground,
} from 'react-native';
import { px2pd } from '../../constants/resolution';
import DirMap from '../../components/maps/DirMap';

const SCENE_MAP_DATA = [
  { point: [0, 0], title: '起点', toScene: 'pomiao', links: [[0, 1], [0, -1], [-1, 0], [1, 0]] },
  { point: [0, 1], title: '选择世界', toScene: 'wzkj', links: [] },
  { point: [1, 0], title: '向右', toScene: 'pomiaomk', links: [[0, -1], [0, 1]] },
  { point: [0, -1], title: '沉浸式阅读', toScene: 'pomiao', links: [], path: [[1, -1], [1, -2], [1, -3], [1, -4], [0, -4], [-1, -4]] },
  { point: [-1, 0], title: '向左', toScene: 'pomiao', links: [[0, 1], [0, -1]] },
  { point: [-2, 0], title: '我有秘籍, 要继续？', toScene: 'pomiao', links: [[-1, 0]], path: [[-2, 1], [-1, 1], [0, 1]] },
  { point: [-1, -1], title: '开始游戏', toScene: 'pomiao', links: [[-1, 0], [0, -1], [-1, -2]] },
  { point: [-1, -2], title: '选择副本', toScene: 'pomiao', links: [[-1, -3]], path: [[0, -2], [0, -1]] },
  { point: [-1, -3], title: '击杀怪物', toScene: 'pomiao', links: [[-1, -4]] },
  { point: [-1, -4], title: '获得奖励', toScene: 'pomiao', links: [], path: [[-2, -4], [-2, -3], [-2, -2], [-2, -1], [-2, 0]] },
];

const DirMapPage = (props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground style={{ width: px2pd(1080), height: px2pd(1808) }} source={require('../../../assets/bg/dir_map.png')}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} pointerEvents='box-none' onTouchStart={(e) => { e.stopPropagation(); }}>
            <DirMap data={SCENE_MAP_DATA} initialCenterPoint={[0,0]} />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default DirMapPage;
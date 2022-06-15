
import React from 'react';

import {
  SafeAreaView,
  View,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import { px2pd } from '../../constants/resolution';
import DirMap from '../../components/maps/DirMap';
import { confirm } from '../../components/dialog/ConfirmDialog';
import { AppDispath, EventKeys } from '../../constants';

const SCENE_MAP_DATA = [
  { point: [0, 0], title: '起点', toChapter: 'WZXX_M1_N1_C001', links: [[0, 1], [0, -1], [-1, 0], [1, 0]] },
  { point: [0, 1], title: '选择世界', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [] },
  { point: [1, 0], title: '向右', toSctoChapterene: 'WZXX_M1_N1_C001B_[C2]', links: [[0, -1], [0, 1]] },
  { point: [0, -1], title: '沉浸式阅读', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [], path: [[1, -1], [1, -2], [1, -3], [1, -4], [0, -4], [-1, -4]] },
  { point: [-1, 0], title: '向左', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [[0, 1], [0, -1]] },
  { point: [-2, 0], title: '我有秘籍, 要继续？', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [[-1, 0]], path: [[-2, 1], [-1, 1], [0, 1]] },
  { point: [-1, -1], title: '开始游戏', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [[-1, 0], [0, -1], [-1, -2]] },
  { point: [-1, -2], title: '选择副本', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [[-1, -3]], path: [[0, -2], [0, -1]] },
  { point: [-1, -3], title: '击杀怪物', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [[-1, -4]] },
  { point: [-1, -4], title: '获得奖励', toChapter: 'WZXX_M1_N1_C001B_[C2]', links: [], path: [[-2, -4], [-2, -3], [-2, -2], [-2, -1], [-2, 0]] },
];

const DirMapPage = (props) => {

  const handleEnterDir = (e) => {
    if (e.toChapter != undefined) {
      confirm("是否重新阅读该章节?", () => {
        DeviceEventEmitter.emit(EventKeys.HIDE_DIRECTORY_MAP);
        setTimeout(() => {
          AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: e.toChapter } });
        }, 300);
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground style={{ width: px2pd(1080), height: px2pd(1808) }} source={require('../../../assets/bg/dir_map.png')}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} pointerEvents='box-none' onTouchStart={(e) => { e.stopPropagation(); }}>
            <DirMap data={SCENE_MAP_DATA} initialCenterPoint={[0,0]} onEnterDir={handleEnterDir} />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default DirMapPage;
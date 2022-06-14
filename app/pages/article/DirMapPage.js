
import React from 'react';
import lo from 'lodash';

import {
  SafeAreaView,
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import { px2pd } from '../../constants/resolution';
import DirMap from '../../components/maps/DirMap';

const SCENE_MAP_DATA = [
  { point: [0, 0], title: '神兽', toScene: 'pomiao', links: [[0, 1], [0, -1], [-1, 0], [1, 0]] },
  { point: [0, 1], title: '原神', toScene: 'wzkj', links: [] },
  { point: [1, 0], title: '天仙', toScene: 'pomiaomk', links: [[0, -1], [0, 1]] },
  { point: [0, -1], title: '五行', toScene: 'pomiao', links: [] },
  { point: [-1, 0], title: '天使', toScene: 'pomiao', links: [[0, 1], [0, -1]] },
  { point: [-2, 0], title: '老者', toScene: 'pomiao', links: [[-1, 0]] },
  { point: [-1, -1], title: '地主', toScene: 'pomiao', links: [[-1, 0], [0, -1]] },
];

const DirMapPage = (props) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground style={{ width: px2pd(1080), height: px2pd(1808) }} source={require('../../../assets/bg/dir_map.png')}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} pointerEvents='box-none'>
              <DirMap data={SCENE_MAP_DATA} initialCenterPoint={[0,0]} />
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default DirMapPage;
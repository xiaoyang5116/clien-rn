
import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import { px2pd } from '../../constants/resolution';
import DirMap from '../../components/maps/DirMap';
import { confirm } from '../../components/dialog/ConfirmDialog';
import { AppDispath, EventKeys } from '../../constants';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableWithoutFeedback } from 'react-native';

const DirMapPage = (props) => {

  const data = React.useRef([]);
  const [ item, setItem ] = React.useState({});

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

  const back = () => {
    DeviceEventEmitter.emit(EventKeys.BACK_DIRECTORY);
  }

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.GOTO_DIRECTORY_MAP, (id) => {
      const item = data.current.find(e => e.id == id);
      if (item != undefined) {
        setItem(item);
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  // 更新最新引用值，解决副作用函数作用域问题。
  data.current = props.data;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground style={{ width: px2pd(1080), height: px2pd(1808) }} source={require('../../../assets/bg/dir_map.png')}>
          <View style={styles.topView} onTouchStart={(e) => e.stopPropagation()}>
            <View style={{ position: 'absolute', left: 10 }}>
              <TouchableWithoutFeedback onPress={back}>
                <AntDesign name={'left'} size={30} />
              </TouchableWithoutFeedback>
            </View>
            <Text style={{ fontSize: 24 }}>{item.title}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} pointerEvents='box-none' onTouchStart={(e) => { e.stopPropagation(); }}>
            <DirMap data={item.map} initialCenterPoint={[0,0]} onEnterDir={handleEnterDir} onClose={back} />
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topView: {
    position: 'absolute', 
    width: '100%', 
    height: 40, 
    top: -50, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

export default DirMapPage;
import React from 'react';
import { Animated, DeviceEventEmitter, ScrollView, StyleSheet } from 'react-native';

import {
  connect,
  getPropIcon,
  AppDispath,
  EventKeys,
} from "../../constants";
  
import { 
  Text, 
  View, 
  TouchableWithoutFeedback 
} from '../../constants/native-ui';

import lo from 'lodash';
import { isPad, px2pd } from '../../constants/resolution';
import StoryUtils from '../../utils/StoryUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import PropGrid from '../../components/prop/PropGrid';

// 两页的格子映射表
const ID_IDX_MAP = [
  [0, 0], [1, 7], [2, 1], [3, 8], [4, 2], [5, 9], [6, 3], [7, 10], [8, 4], [9, 11], [10, 5], [11, 12], [12, 6], [13, 13],
  [14, 14], [15, 21], [16, 15], [17, 22], [18, 16], [19, 23], [20, 17], [21, 24], [22, 18], [23, 25], [24, 19], [25, 26], [26, 20], [27, 27]
];

const BoxItem = (props) => {

  const onClick = (item) => {
    if (item == undefined)
      return

    if (item.action != undefined && lo.isObject(item.action)) {
      const payload = { ...item.action };
      if (props.refScene.current != null) {
        payload.__sceneId = props.refScene.current.id;
      }
      AppDispath({ type: 'SceneModel/processActions', payload, cb: () => {
        StoryUtils.refreshCurrentChat();
        DeviceEventEmitter.emit(EventKeys.REFRESH_MISSION_PROPSBAR);
      }});
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onClick(props.prop)}>
      <View style={[props.style, styles.boxItem]}>
        {
        (props.prop != undefined)
        ? <PropGrid prop={props.prop} imageStyle={{ width: px2pd(110), height: px2pd(110) }} />
        : <></>
        }
      </View>
    </TouchableWithoutFeedback>
  );
}

const MissionBar = (props) => {

  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const zIndex = React.useRef(new Animated.Value(0)).current;
  const showBtnOpacity = React.useRef(new Animated.Value(0)).current;
  const refCurrentScene = React.useRef(null);
  const needRefresh = React.useRef(false);
  const [boxes, setBoxes] = React.useState([]);

  const min = () => {
    Animated.timing(translateY, {
      toValue: isPad() ? px2pd(570) : px2pd(696),
      duration: 300,
      useNativeDriver: true,
    }).start((r) => {
      const { finished } = r;
      if (finished) {
        zIndex.setValue(0);
        Animated.timing(showBtnOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });
  }

  const show = () => {
    opacity.setValue(1);
    // zIndex.setValue(100);
    showBtnOpacity.setValue(0);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start((r) => {
    });
  }

  const hide =() => {
    opacity.setValue(0);
    min();
  }

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.REFRESH_MISSION_PROPSBAR, () => {
      if (refCurrentScene.current == null)
        return

      // 没有指定剧情道具则不显示剧情道具栏
      if (lo.isArray(refCurrentScene.current.plotPropsId) && refCurrentScene.current.plotPropsId.length > 0) {
        show();
      } else {
        hide();
        return
      }

      AppDispath({ type: 'PropsModel/getPropsFromAttr', payload: { attr: '剧情' }, cb: (v) => {
        const vv = lo.cloneDeep(v);
        const list = vv.filter(e => lo.indexOf(refCurrentScene.current.plotPropsId, e.id) != -1);
  
        const items = [];
        lo.range(28).forEach(e => {
          let prop = undefined;
          const found = ID_IDX_MAP.find(i => i[0] == e);
          if (found != null) {
            prop = list[found[1]];
          }
          items.push(<BoxItem key={e} style={(e <= 1) ? { marginLeft: 10 } : {}} prop={prop} refScene={refCurrentScene} />);
        });
        setBoxes(items);
      } });
    });

    // 解决emit消息发送后，监听器未注册的情况
    if (needRefresh.current) {
      DeviceEventEmitter.emit(EventKeys.REFRESH_MISSION_PROPSBAR);
      needRefresh.current = false;
    }

    return () => {
      listener.remove();
    }
  }, []);

  // 当场景发生变化时刷新
  if (props.scene != null && (refCurrentScene.current == null || !lo.isEqual(refCurrentScene.current.id, props.scene.id))) {
    refCurrentScene.current = props.scene;
    needRefresh.current = true;
    DeviceEventEmitter.emit(EventKeys.REFRESH_MISSION_PROPSBAR);
  }

  return (
      <Animated.View style={[styles.viewContainer, { transform: [{ translateY: translateY }], opacity: opacity, zIndex: zIndex }]}>
        <Animated.View style={[{ position: 'absolute', right: px2pd(220), top: -120 }, { opacity: showBtnOpacity }]}>
          <AntDesign name='upcircleo' color={'#000'} size={isPad() ? 30 : 20} onPress={() => show()} />
        </Animated.View>
        <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false} style={{}}>
          <View style={{ flexWrap: 'wrap' }}>
            {boxes}
          </View>
        </ScrollView>
        <TouchableWithoutFeedback onPress={() => min()}>
          <FastImage style={{ position: 'absolute', right: 23, top: -9, width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_min_button.png')} />
        </TouchableWithoutFeedback>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute', 
    bottom: 63, 
    width: '100%', 
    height: px2pd(400), 
    backgroundColor: '#a49f99', 
  },

  boxItem: {
    width: px2pd(120), 
    height: px2pd(120), 
    marginRight: 10, 
    marginTop: 15, 
    marginBottom: 6,
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default connect((state) => ({ ...state.StoryModel }))(MissionBar);
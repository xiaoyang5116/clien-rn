import React from 'react';

import {
  View,
  Text,
  DeviceEventEmitter,
  SafeAreaView,
  Animated,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Easing
} from 'react-native';

import {
  EventKeys,
  getWindowSize,
  AppDispath,
  StyleSheet,
} from "../../constants";

import ImageCapInset from 'react-native-image-capinsets-next';
import Toast from '../../components/toast';
import TransAnimation from './TransAnimation';
import FastImage from 'react-native-fast-image';
import RootView from '../RootView';
import { confirm } from '../dialog/ConfirmDialog';
import { ReturnButton, TextButton } from '../../constants/custom-ui';
import { px2pd } from '../../constants/resolution';

const winSize = getWindowSize();
const PROP_ID = 44; // 时空宝玉

const previewImages = [
  {
    worldId: 0,
    // img: require('../../../assets/world/world_0.jpg')
    bgImg: require('../../../assets/world/world_0/bg.png'),
    title: require('../../../assets/world/world_0/title.png'),
    cover: require('../../../assets/world/world_0/cover.png'),
  },
  {
    worldId: 1,
    // img: require('../../../assets/world/world_1.jpg')
    bgImg: require('../../../assets/world/world_1/bg.png'),
    title: require('../../../assets/world/world_1/title.png'),
    cover: require('../../../assets/world/world_1/cover.png'),

  },
  {
    worldId: 2,
    // img: require('../../../assets/world/world_2.jpg'),
    bgImg: require('../../../assets/world/world_2/bg.png'),
    title: require('../../../assets/world/world_2/title.png'),
    cover: require('../../../assets/world/world_2/cover.png'),
  },
];

const WorldPreview = (props) => {
  const { item } = props;
  const [propNum, setPropNum] = React.useState(-1);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const spinFunc = () => {
    spinValue.setValue(0)
    Animated.timing(spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: 40000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(() => spinFunc())
  }
  const spin = spinValue.interpolate({
    inputRange: [0, 1],//输入值
    outputRange: ['0deg', '360deg'] //输出值
  })

  React.useEffect(() => {
    AppDispath({
      type: 'PropsModel/getPropNum',
      payload: { propId: PROP_ID },
      cb: (result) => {
        setPropNum(result);
      }
    });
  }, []);

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
    spinFunc()
  }, []);

  if (propNum >= 0) {
    const prevImg = previewImages.find(e => e.worldId == item.worldId)
    const propEnough = propNum > 0;

    const handlerEnter = () => {
      if (!propEnough) {
        Toast.show('时空宝玉不足！', 'CenterToTop');
      } else {
        confirm(`进入${item.title}消耗道具：时空宝玉x1`, () => {
          props.onClose();
          AppDispath({ type: 'PropsModel/reduce', payload: { propsId: [PROP_ID], num: 1 } });
          const key = RootView.add(<TransAnimation onCompleted={() => {
            if (props.animation != undefined && props.animation) {
              if (props.item.toChapter != undefined) {
                AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: props.item.toChapter, __sceneId: '' } });
              }
            } else {
              DeviceEventEmitter.emit(EventKeys.CAROUSEL_SELECT_ITEM, { item: props.item, index: props.index });
            }
            RootView.remove(key);
          }} />);
        });
      }
    }

    return (
      <View style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
        <FastImage style={{ position: 'absolute', width: "100%", height: "100%" }} source={prevImg.bgImg} />
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: opacity }}>
            <View style={styles.bodyContainer}>
              <FastImage style={{ position: 'absolute', width: px2pd(651), height: px2pd(253) }} source={prevImg.title} />
              <View style={styles.coverContainer}>
                <FastImage style={{ position: 'absolute', width: px2pd(1080), height: px2pd(784), }} source={prevImg.cover} />
                <FastImage style={{ width: px2pd(1080), height: px2pd(875) }} source={require('../../../assets/world/yun.png')} />
              </View>
              <View style={styles.descContainer}>
                <ImageBackground source={require('../../../assets/world/TextBg.png')} style={styles.textContainer}>
                  <Text style={{ fontSize: 18, paddingLeft: 30, paddingRight: 30, color: '#000' }}>{(item.desc != undefined ? item.desc : item.body)}</Text>
                </ImageBackground>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center", marginTop: 18 }}>
                <TouchableOpacity
                  onPress={handlerEnter}
                  style={{ position: "absolute", width: px2pd(260), height: px2pd(122), zIndex: 2 }}
                >
                  <FastImage style={{ width: px2pd(260), height: px2pd(122) }} source={require('../../../assets/world/enter.png')} />
                </TouchableOpacity>
                <FastImage style={{ width: px2pd(522), height: px2pd(335), marginLeft: 20 }} source={require('../../../assets/world/enterBg.png')} />
                <Animated.Image
                  style={{ width: px2pd(247), height: px2pd(248), position: "absolute", zIndex: 0, transform: [{ rotate: spin }] }}
                  source={require('../../../assets/world/enterBg_yuan.png')}
                />
              </View>
              {
                (!propEnough)
                  ? (
                    <View style={styles.tipsContainer}>
                      <Text style={{ color: '#ff1112' }}>* 道具数量不足，当前数量={propNum}</Text>
                    </View>
                  ) : (<></>)
              }
              <View style={{ position: "absolute", bottom: Platform.OS === "android" ? 12 : 0 }}>
                <ReturnButton onPress={props.onClose} />
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  } else {
    return (<></>);
  }
}

export default WorldPreview;

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    width: '100%',
  },
  coverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: px2pd(150)
  },
  descContainer: {
    width: '100%',
    alignItems: 'center'
  },
  textContainer: {
    width: px2pd(1046),
    height: px2pd(467),
    justifyContent: 'center',
    alignItems: "center"
  },
  tipsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
});
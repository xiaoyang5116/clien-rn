
import React from 'react';

import lo from 'lodash';

import {
  connect,
  Component,
  StyleSheet,
  action,
  EventKeys,
  AppDispath,
  DataContext,
  getWindowSize,
  statusBarHeight,
  getChapterImage,
  ThemeContext
} from "../constants";

import { 
  View,
  Text,
  FlatList,
} from '../constants/native-ui';

import {
  Platform,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Block from '../components/article';
import { DeviceEventEmitter } from 'react-native';
import { CarouselUtils } from '../components/carousel';
import { TextButton } from '../constants/custom-ui';
import RootView from '../components/RootView';
import ReaderSettings from '../components/readerSettings';
import HeaderContainer from '../components/article/HeaderContainer';
import FooterContainer from '../components/article/FooterContainer';
import * as RootNavigation from '../utils/RootNavigation';
import Collapse from '../components/collapse';
import Drawer from '../components/drawer';
import LeftContainer from '../components/article/LeftContainer';
import DirectoryPage from './article/DirectoryPage';
import RightContainer from '../components/article/RightContainer';
import DirMapPage from './article/DirMapPage';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../constants/resolution';

const WIN_SIZE = getWindowSize();
const Tab = createMaterialTopTabNavigator();

const WORLD = [
  {
    worldId: 0,
    title: "现实",
    body: "现实场景，这里添加更多描述",
    desc: "现实场景，这里添加更多描述, 现实场景，这里添加更多描述, 现实场景，这里添加更多描述, 现实场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/11/200/300",
    toChapter: "WZXX_M1_N1_C001",
  },
  {
    worldId: 1,
    title: "灵修界",
    body: "灵修场景，这里添加更多描述",
    desc: "灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/10/200/300",
    toChapter: "WZXX_M1_N1_C002",
  },
  {
    worldId: 2,
    title: "尘界",
    body: "尘界场景，这里添加更多描述",
    desc: "尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/12/200/300",
    toChapter: "WZXX_M1_N1_C003",
  },
];

const TAB_BUTTONS = [
  { title: '世界', action: () => { RootNavigation.navigate('Home', { screen: 'World' }) } },
  { title: '探索', action: () => { RootNavigation.navigate('Home', { screen: 'Explore' }) } },
  { title: '城镇', action: () => { RootNavigation.navigate('Home', { screen: 'Town' }) } },
  { title: '制作', action: () => { RootNavigation.navigate('Home', { screen: 'Compose' }) } },
  { title: '道具', action: () => { RootNavigation.navigate('Home', { screen: 'Props' }) } },
  { title: '抽奖', action: () => { RootNavigation.navigate('Home', { screen: 'Lottery' }) } },
]

const WorldSelector = () => {
  CarouselUtils.show({ 
    data: WORLD, 
    initialIndex: Math.floor(WORLD.length / 2), 
    onSelect: (p) => {
      if (p.item.toChapter != undefined) {
        AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: p.item.toChapter, __sceneId: '' } });
      }
    }
  });
}

const ReaderBackgroundImageView = () => {
  const context = React.useContext(DataContext);
  const currentImageId = React.useRef('');
  const [image, setImage] = React.useState(<></>);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.READER_BACKGROUND_IMG_UPDATE, ({ imageId, defaultOpacity }) => {
      if (lo.isEqual(currentImageId.current, imageId))
        return;
      //
      if (lo.isEmpty(imageId)) {
        setTimeout(() => setImage(<></>), 0);
      } else {
        const res = getChapterImage(imageId);
        setTimeout(() => {
          context.readerBgImgOpacity.setValue(defaultOpacity);
          setImage(<Animated.Image style={{ width: res.width, height: res.height, opacity: context.readerBgImgOpacity }} source={res.source} />);
        }, 0);
      }
      //
      currentImageId.current = imageId;
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
  <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
    {image}
  </View>
  );
}

const UserAttributesHolder = (props) => {
  const [ data, setData ] = React.useState(props.config);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.USER_ATTR_UPDATE, () => {
      const cb = (result) => {
        const newData = lo.cloneDeep(data);
        result.forEach(e => {
          const { key, value } = e;
          newData.forEach(e => {
            e.data.forEach(e => {
              e.forEach(e => {
                if (e.key == key) {
                  e.value = value;
                }
              })
            });
          });
        });
        //
        setData(newData);
      };
      AppDispath({ type: 'UserModel/getAttrs', cb });
    });

    // 更新角色属性
    DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);
    
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <Collapse 
      data={data}
      renderItem={(item) => {
        return (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 50 }}><Text>{item.title}:</Text></View>
            <View><Text style={{ color: '#666' }}>{item.value}</Text></View>
          </View>
        );
      }}
      renderGroupHeader={(section) => {
        return (
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{section.title}</Text>
        );
      }}
    />
  );
}

const WorldUnlockView = (props) => {

  const back = () => {
    props.navigation.navigate('PrimaryWorld');
    props.onClose();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <View style={{ 
        width: '80%', 
        height: 150, 
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#ddd',
        shadowColor: "#0d152c",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6, }}>
          <Text style={{ fontSize: 24 }}>当前世界未解锁</Text>
          <TouchableWithoutFeedback onPress={back}>
            <View style={{ width: 130, height: 30, borderWidth: 1, borderColor: '#bbb', justifyContent: 'center', alignItems: 'center' }}>
              <Text>返回</Text>
            </View>
          </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const TheWorld = (props) => {
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const started = React.useRef(false);
  const refList = React.useRef(null);
  const context = React.useContext(DataContext);
  const maskOpacity = React.useRef(new Animated.Value(1)).current;
  const fontOpacity = React.useRef(new Animated.Value(0)).current;

  const { navigation } = props;
  const state = navigation.getState();
  const index = state.index;
  const activeRouteName = state.routeNames[index];
  const routeName = props.route.name;

  const scrollHandler = (payload) => {
    const { x, y } = payload.nativeEvent.contentOffset;
    props.dispatch(action('ArticleModel/scroll')({ 
      offsetX: x, offsetY: y, 
      textOpacity: context.readerTextOpacity,
      bgImgOpacity: context.readerBgImgOpacity,
    }));

    // 屏蔽：需求 --- 手动点击才隐藏上下功能区域。
    // DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_SCROLL, payload);
  }

  const endReachedHandler = () => {
    props.dispatch(action('ArticleModel/end')({}));
  }

  const onTouchTransView = () => {
    fontOpacity.setValue(0);
    const key = RootView.add(<WorldUnlockView {...props} onClose={() => RootView.remove(key)} />);
  }

  React.useEffect(() => {
    if (props.sections.length <= 0)
      return;

    if (!props.continueView) {
      refList.current.scrollToIndex({ index: 0, animated: false });
    }
  }, [props.sections]);

  // 首次进入
  React.useEffect(() => {
    if (lo.isEqual(routeName, activeRouteName)) {
      maskOpacity.setValue(0);
      fontOpacity.setValue(0);
    } else {
      maskOpacity.setValue(1);
      fontOpacity.setValue(0);
    }
  }, []);

  // 通过透明度播放过度效果
  React.useEffect(() => {
    if (!lo.isEqual(routeName, activeRouteName)) {
      maskOpacity.setValue(1);
      fontOpacity.setValue(0);
      return;
    }
    //
    if (lo.isEqual(routeName, 'RightWorld')) {
      // Animated.sequence([
      //   Animated.timing(maskOpacity, {
      //     toValue: 0,
      //     duration: 2000,
      //     useNativeDriver: false,
      //   })
      // ]).start();
    } else if (lo.isEqual(routeName, 'LeftWorld')) {
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(fontOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(fontOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.delay(600),
        Animated.timing(fontOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        })
      ]).start();
    }
  }, [props]);

  return (
    <View style={[{ flex: 1 }, { backgroundColor: props.readerStyle.bgColor }]}>
      <ReaderBackgroundImageView />
      <FlatList
        style={{ alignSelf: 'stretch' }}
        ref={(ref) => refList.current = ref}
        data={props.sections}
        renderItem={(data) => <Block data={data.item} />}
        keyExtractor={item => item.key}
        onScroll={scrollHandler}
        onEndReached={endReachedHandler}
        initialNumToRender={2}
        maxToRenderPerBatch={5}
        onTouchStart={(e) => {
          if (e.nativeEvent.pageX < WIN_SIZE.width - 40)
            return;

          startX.current = e.nativeEvent.pageX;
          startY.current = e.nativeEvent.pageY;
          started.current = true;
        }}
        onTouchMove={(e) => {
          if (!started.current)
            return;

          const dx = e.nativeEvent.pageX - startX.current;
          const dy = e.nativeEvent.pageY - startY.current;

          if (Math.abs(dx) >= 10) {
            if (dx < 0) {
              context.slideMoving = true;
            }
          }
        }}
        onTouchEnd={() => {
          started.current = false;
        }}
        onTouchCancel={() => {
          started.current = false;
        }}
      />
      {/* 白色遮盖层 */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: maskOpacity }} 
        onTouchStart={onTouchTransView} 
        pointerEvents={(lo.isEqual(routeName, 'PrimaryWorld') ? 'none' : 'auto')}>
        <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: fontOpacity }}>
          {(lo.isEqual(routeName, 'LeftWorld')) ? (<Text style={styles.tranSceneFontStyle}>其实，修真可以改变现实。。。</Text>) : <></>}
          {(lo.isEqual(routeName, 'PrimaryWorld')) ? (<Text style={styles.tranSceneFontStyle}>所念即所现，所思即所得。。。</Text>) : <></>}
        </Animated.View>
      </Animated.View>
  </View>
  );
}

const WorldTabBar = (props) => {
  const { state, descriptors, navigation, position } = props;
  const routeKey = state.routes[state.index].key;
  const descriptor = descriptors[routeKey];
  const { options } = descriptor;

  return (
    <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: '#333' }}>{options.tabBarLabel}</Text>
    </View>
  );
}

const FooterTabBar = (props) => {
  const theme = React.useContext(ThemeContext);

  const buttons = [];
  let key = 0;

  TAB_BUTTONS.forEach(e => {
    const { title, action } = e;
    buttons.push(
      <TouchableWithoutFeedback key={key++} onPress={action}>
        <View style={styles.bottomBannerButton}>
          <FastImage style={[theme.tabBottomImgStyle, { position: 'absolute' }]} source={theme.tabBottomImage} />
          <Text style={[theme.tabBottomLabelStyle, { position: 'absolute', width: 24, fontSize: px2pd(60), color: '#fff' }]}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  return (
    <View style={[styles.bannerStyle, { marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
      {buttons}
    </View>
  );
}

class NewArticlePage extends Component {

  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.refPropsContainer = React.createRef();
    this.refDirectory = React.createRef();
    this.refDirMap = React.createRef();
    this.longPressListener = null;
    this.gotoDirMapListener = null;
    this.listeners = [];
  }

  componentDidMount() {
    this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));

    this.listeners.push(
      DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_LONG_PRESS, (e) => {
        WorldSelector();
      })
    );

    this.listeners.push(
      DeviceEventEmitter.addListener(EventKeys.GOTO_DIRECTORY_MAP, () => {
        this.refDirectory.current.close();
        this.refDirMap.current.open();
      })
    );
  }

  componentWillUnmount() {
    this.listeners.forEach(e => e.remove());
    this.listeners.length = 0;
  }

  openDirectory = (e) => {
    DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
    setTimeout(() => {
      this.refDirectory.current.open();
    }, 500);
  }

  render() {
    const { readerStyle, attrsConfig } = this.props;
    return (
      <View style={[styles.viewContainer, { backgroundColor: readerStyle.bgColor }]}>
        <HeaderContainer>
          <View style={[styles.bannerStyle, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0) }]}>
            <View style={styles.bannerButton}>
              <TextButton title='X' onPress={() => {
                  DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='选择世界' onPress={WorldSelector} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='退出阅读' onPress={() => {
                this.props.navigation.navigate('First');
                AppDispath({ type: 'ArticleModel/cleanup' });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='目录' onPress={this.openDirectory} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='夜间' />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='设置' onPress={()=>{
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                const key =RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
              }} />
            </View>
          </View>
        </HeaderContainer>
        <View style={[styles.bodyContainer, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0), marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
          <Tab.Navigator initialRouteName='PrimaryWorld' 
            tabBar={(props) => <WorldTabBar {...props} />}
            screenOptions={{ swipeEnabled: !this.props.isStartPage }}
            >
            <Tab.Screen name="LeftWorld" options={{ tabBarLabel: '现实' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="PrimaryWorld" options={{ tabBarLabel: '灵修界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="RightWorld" options={{ tabBarLabel: '尘界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
          </Tab.Navigator>
        </View>
        <FooterContainer>
          <FooterTabBar />
        </FooterContainer>
        <Drawer ref={this.refPropsContainer}>
          {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
        </Drawer>
        <LeftContainer ref={this.refDirectory}>
          <DirectoryPage />
        </LeftContainer>
        <RightContainer ref={this.refDirMap}>
          <DirMapPage />
        </RightContainer>
        {/* <View style={styles.debugContainer} pointerEvents="box-none" >
          <View style={styles.debugView1} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域1</Text>
          </View>
          <View style={styles.debugView2} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域2</Text>
          </View>
          <View style={styles.debugView3} pointerEvents="box-none">
            <Text style={{ color: '#fff' }}>事件触发区域3</Text>
          </View>
        </View> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: "flex-start", 
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  debugContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugView1: {
    marginBottom: 35,
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  debugView2: {
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  debugView3: {
    marginTop: 35,
    borderWidth: 1, 
    borderColor: '#999', 
    width: '100%', 
    height: 200, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  bannerStyle: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  bannerButton: {
    width: 100,
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 0,
    marginBottom: 10,
  },
  bottomBannerButton: {
    width: 45,
    height: 80,
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 0,
    marginBottom: 10,
  },
  tranSceneFontStyle: {
    fontSize: 24, 
    color: '#333',
  }
});

export default connect((state) => ({ ...state.ArticleModel }))(NewArticlePage);
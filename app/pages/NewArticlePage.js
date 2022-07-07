
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
import TipsView from '../components/article/TipsView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    title: "尘界",
    body: "尘界场景，这里添加更多描述",
    desc: "尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/12/200/300",
    toChapter: "WZXX_M1_N1_C003",
  },
  {
    worldId: 2,
    title: "灵修界",
    body: "灵修场景，这里添加更多描述",
    desc: "灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/10/200/300",
    toChapter: "WZXX_M1_N1_C002",
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
  const nextImage = React.useRef(null);
  const [image, setImage] = React.useState(<></>);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.READER_BACKGROUND_IMG_UPDATE, ({ imageId, defaultOpacity }) => {
      if (lo.isEqual(currentImageId.current, imageId))
        return;

      if (lo.isEmpty(imageId)) {
        currentImageId.current = '';
        setTimeout(() => setImage(<></>), 0);
      } else if (lo.isEmpty(currentImageId.current)) {
        currentImageId.current = imageId;
        setTimeout(() => {
          const res = getChapterImage(imageId);
          context.readerBgImgOpacity.setValue(defaultOpacity);
          setImage(<Animated.Image style={{ width: res.width, height: res.height, opacity: context.readerBgImgOpacity }} source={res.source} />);
        }, 0);
      } else { // 先清除老的图片，再显示新的。（ 老图片同样绑定了 context.readerBgImgOpacity ）
        currentImageId.current = imageId;
        nextImage.current = { imageId, defaultOpacity };
        setTimeout(() => setImage(<></>), 0);
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    if (nextImage.current != null) {
      const { imageId, defaultOpacity } = nextImage.current;
      nextImage.current = null;

      currentImageId.current = imageId;
      setTimeout(() => {
        const res = getChapterImage(imageId);
        context.readerBgImgOpacity.setValue(defaultOpacity);
        setImage(<Animated.Image style={{ width: res.width, height: res.height, opacity: context.readerBgImgOpacity }} source={res.source} />);
      }, 0);
    }
  }, [image])

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
          <Text style={{ fontSize: 24, color: '#000' }}>当前世界未解锁</Text>
          <TouchableWithoutFeedback onPress={back}>
            <View style={{ width: 130, height: 30, borderWidth: 1, borderColor: '#bbb', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#000' }}>返回</Text>
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
  const tipsKey = React.useRef(null);
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

    // 页面滚动时删除浮层提示
    if (tipsKey.current != null) {
      RootView.remove(tipsKey.current);
      tipsKey.current = null;
    }
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
    if (lo.isEqual(routeName, 'LeftWorld') || lo.isEqual(routeName, 'RightWorld')) {
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(fontOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (lo.isEqual(routeName, 'PrimaryWorld')) {
      Animated.sequence([
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      ]).start();
    }
  }, [props]);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_CLICK_LINK, (e) => {
      if (!lo.isEqual(routeName, 'PrimaryWorld'))
        return;

      if (tipsKey.current != null) {
        RootView.remove(tipsKey.current);
      }

      const key = RootView.add(<TipsView { ...e } />);
      tipsKey.current = key;
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.NAVIGATION_ROUTE_CHANGED, ({ routeName }) => {
      if (lo.isEqual(routeName, 'Article')) {
        // 页面切换时删除浮层提示
        if (tipsKey.current != null) {
          RootView.remove(tipsKey.current);
          tipsKey.current = null;
        }
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

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
          {(lo.isEqual(routeName, 'RightWorld')) ? (<Text style={styles.tranSceneFontStyle}>所念即所现，所思即所得。。。</Text>) : <></>}
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
      DeviceEventEmitter.addListener(EventKeys.GOTO_DIRECTORY_MAP, (id) => {
        this.refDirectory.current.close();
        this.refDirMap.current.open();
      })
    );

    this.listeners.push(
      DeviceEventEmitter.addListener(EventKeys.BACK_DIRECTORY, () => {
        this.refDirectory.current.open();
        this.refDirMap.current.close();
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
            <TouchableWithoutFeedback onPress={() => {
              DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
            }}>
              <View style={styles.bannerButton}>
                <AntDesign name={'menufold'} size={21} />
                <Text style={styles.bannerButtonText}>菜单选项</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={this.openDirectory}>
              <View style={styles.bannerButton}>
                <AntDesign name={'bars'} size={23} />
                <Text style={styles.bannerButtonText}>章节目录</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={WorldSelector}>
              <View style={styles.bannerButton}>
                <AntDesign name={'select1'} size={21} />
                <Text style={styles.bannerButtonText}>切换世界</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <View style={styles.bannerButton}>
                <FontAwesome name={'moon-o'} size={23} />
                <Text style={styles.bannerButtonText}>夜间模式</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                const key =RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
              }}>
              <View style={styles.bannerButton}>
                <Ionicons name={'ios-text'} size={23} />
                <Text style={styles.bannerButtonText}>阅读设置</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.navigate('First');
                AppDispath({ type: 'ArticleModel/cleanup' });
              }}>
              <View style={styles.bannerButton}>
                <Ionicons name={'exit-outline'} size={23} />
                <Text style={styles.bannerButtonText}>返回主页</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </HeaderContainer>
        <View style={[styles.bodyContainer, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0), marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
          <Tab.Navigator initialRouteName='PrimaryWorld' 
            tabBar={(props) => <WorldTabBar {...props} />}
            screenOptions={{ swipeEnabled: !this.props.isStartPage }}
            >
            <Tab.Screen name="LeftWorld" options={{ tabBarLabel: '现实' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="PrimaryWorld" options={{ tabBarLabel: '尘界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="RightWorld" options={{ tabBarLabel: '灵修界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
          </Tab.Navigator>
        </View>
        <FooterContainer>
          <FooterTabBar />
        </FooterContainer>
        <Drawer ref={this.refPropsContainer}>
          {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
        </Drawer>
        <LeftContainer ref={this.refDirectory}>
          <DirectoryPage data={this.props.dirData} />
        </LeftContainer>
        <RightContainer ref={this.refDirMap}>
          <DirMapPage data={this.props.dirData} />
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
    // flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  bannerButton: {
    width: 55,
    marginLeft: 5, 
    marginRight: 5,
    marginTop: 0,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerButtonText: {
    marginTop: 10,
    color: '#000',
    fontSize: 12,
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
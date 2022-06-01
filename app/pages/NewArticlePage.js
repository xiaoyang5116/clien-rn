
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
  statusBarHeight
} from "../constants";

import { 
  View,
  Text,
  FlatList,
} from '../constants/native-ui';

import {
  Platform,
  Animated,
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
    props.dispatch(action('ArticleModel/scroll')({ 
      offsetX: payload.nativeEvent.contentOffset.x,
      offsetY: payload.nativeEvent.contentOffset.y,
    }));

    DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_SCROLL, payload);
  }

  const endReachedHandler = () => {
    props.dispatch(action('ArticleModel/end')({}));
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
      Animated.sequence([
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        })
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
              // this.refPropsContainer.current.offsetX(-dx);
              context.slideMoving = true;
            }
          }
        }}
        onTouchEnd={() => {
          // this.refPropsContainer.current.release();
          started.current = false;
        }}
        onTouchCancel={() => {
          // this.refPropsContainer.current.release();
          started.current = false;
        }}
      />
      {/* 白色遮盖层 */}
      <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: maskOpacity }} pointerEvents='none'>
        <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: fontOpacity }}>
          {(lo.isEqual(routeName, 'LeftWorld')) ? (<Text style={{ fontSize: 24 }}>其实，修真可以改变现实。。。</Text>) : <></>}
          {(lo.isEqual(routeName, 'PrimaryWorld')) ? (<Text style={{ fontSize: 24 }}>所念即所现，所思即所得。。。</Text>) : <></>}
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

class NewArticlePage extends Component {

  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.refPropsContainer = React.createRef();
    this.longPressListener = null;
  }

  componentDidMount() {
    this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));

    // 长按监听器
    this.longPressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_LONG_PRESS, (e) => {
      WorldSelector();
    });
  }

  componentWillUnmount() {
    this.longPressListener.remove();
  }

  render() {
    const { readerStyle, attrsConfig } = this.props;
    return (
      <View style={[styles.viewContainer, { backgroundColor:readerStyle.bgColor }]}>
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
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='目录' />
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
            >
            <Tab.Screen name="LeftWorld" options={{ tabBarLabel: '现实' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="PrimaryWorld" options={{ tabBarLabel: '灵修界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
            <Tab.Screen name="RightWorld" options={{ tabBarLabel: '尘界' }} children={(props) => <TheWorld {...this.props} {...props} />} />
          </Tab.Navigator>
        </View>
        <FooterContainer>
          <View style={[styles.bannerStyle, { marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
            <View style={styles.bannerButton}>
              <TextButton title='世界' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'World',
                });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='探索' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'Explore',
                });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='城镇' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'Town',
                });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='制作' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'Compose',
                });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='道具' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'Props',
                });
              }} />
            </View>
            <View style={styles.bannerButton}>
              <TextButton title='抽奖' onPress={() => {
                RootNavigation.navigate('Home', {
                  screen: 'Lottery',
                });
              }} />
            </View>
          </View>
        </FooterContainer>
        <Drawer ref={this.refPropsContainer}>
          {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
        </Drawer>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: "flex-start", 
    // backgroundColor: "#eee7dd"
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
});

export default connect((state) => ({ ...state.ArticleModel }))(NewArticlePage);

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
  getWindowSize
} from "../constants";

import { 
  View,
  Text,
  FlatList,
} from '../constants/native-ui';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Block from '../components/article';
import { DeviceEventEmitter } from 'react-native';
import { CarouselUtils } from '../components/carousel';
import { TextButton } from '../constants/custom-ui';
import RootView from '../components/RootView';
import ReaderSettings from '../components/readerSettings';
import HeaderContainer from '../components/article/HeaderContainer';
import FooterContainer from '../components/article/FooterContainer';
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

  return (
  <View style={[{ flex: 1 }, { backgroundColor: props.readerStyle.bgColor }]}>
      <FlatList
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
            <View style={[styles.bannerStyle, { marginTop: 20, }]}>
              <TextButton title='X' onPress={() => {
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
              }} />
              <TextButton title='选择世界' onPress={WorldSelector} />
              <TextButton title='退出阅读' onPress={() => {
                this.props.navigation.navigate('First');
              }} />
            </View>
          </HeaderContainer>
          <View style={styles.topBarContainer}>
          </View>
          <View style={styles.bodyContainer}>
            <Tab.Navigator initialRouteName='PrimaryWorld' 
              tabBar={(props) => <WorldTabBar {...props} />}
              >
              <Tab.Screen name="LeftWorld" options={{ tabBarLabel: '现实' }} children={() => <TheWorld {...this.props} />} />
              <Tab.Screen name="PrimaryWorld" options={{ tabBarLabel: '灵修界' }} children={() => <TheWorld {...this.props} />} />
              <Tab.Screen name="RightWorld" options={{ tabBarLabel: '尘界' }} children={() => <TheWorld {...this.props} />} />
            </Tab.Navigator>
          </View>
          <FooterContainer>
            <View style={styles.bannerStyle}>
              <TextButton title='目录' />
              <TextButton title='夜间' />
              <TextButton title='设置' onPress={()=>{
                DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
                const key =RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
              }} />
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
  topBarContainer: {
    height: 40,
    backgroundColor: "#999"
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
    justifyContent: 'space-around', 
    alignItems: 'center',
  },
});

export default connect((state) => ({ ...state.ArticleModel }))(NewArticlePage);
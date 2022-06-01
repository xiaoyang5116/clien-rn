
import React from 'react';

import lo, { set } from 'lodash';

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
import CluesList from '../components/cluesList/CluesList';

const WIN_SIZE = getWindowSize();

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
  const [data, setData] = React.useState(props.config);

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

const ReaderTab = (props) => {
  const [tab, setTab] = React.useState("UserAttributesHolder")
  const { attrsConfig } = props
  const toggleTab = (tabkey) => {
    if (tab === tabkey) return null
    setTab(tabkey)
  }

  return (
    <View style={styles.tabDrawer}>
      <View style={styles.tabContainer}>
        <TextButton title={"属性"} onPress={() => { toggleTab("UserAttributesHolder") }} />
        <TextButton title={"线索"} onPress={() => { toggleTab("CluesList") }} />
      </View>
      <View style={styles.contentContainer}>
        <View style={{ flex: 1, display: tab === "CluesList" ? "flex" : "none" }}>
          <CluesList />
        </View>
        <View style={{ flex: 1, display: tab === "UserAttributesHolder" ? "flex" : "none" }}>
          {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>}
        </View>

      </View>
    </View>
  )

}



class ArticlePage extends Component {

  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.refList = React.createRef();
    this.refPropsContainer = React.createRef();
    this.longPressListener = null;
    this.startX = 0;
    this.startY = 0;
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

  componentDidUpdate() {
    if (!this.props.continueView) {
      this.refList.current.scrollToIndex({ index: 0, animated: false });
    }
  }

  viewableItemsChangedhandler = (payload) => {
  }

  scrollHandler = (payload) => {
    this.props.dispatch(action('ArticleModel/scroll')({
      offsetX: payload.nativeEvent.contentOffset.x,
      offsetY: payload.nativeEvent.contentOffset.y,
    }));

    DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_SCROLL, payload);
  }

  endReachedHandler = () => {
    this.props.dispatch(action('ArticleModel/end')({}));
  }

  render() {
    const { readerStyle, attrsConfig } = this.props;
    return (
      <View style={[styles.viewContainer, { backgroundColor: readerStyle.bgColor }]}>
        <HeaderContainer>
          <View style={[styles.bannerStyle, { marginTop: 20, }]}>
            <TextButton title='X' onPress={() => {
              DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
            }} />
            <TextButton title='选择世界' onPress={WorldSelector} />
            <TextButton title='...' />
          </View>
        </HeaderContainer>
        <View style={styles.topBarContainer}>
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            ref={this.refList}
            data={this.props.sections}
            renderItem={(data) => <Block data={data.item} />}
            keyExtractor={item => item.key}
            onViewableItemsChanged={this.viewableItemsChangedhandler}
            onScroll={this.scrollHandler}
            onEndReached={this.endReachedHandler}
            initialNumToRender={2}
            maxToRenderPerBatch={5}
            onTouchStart={(e) => {
              if (e.nativeEvent.pageX < WIN_SIZE.width - 40)
                return;

              this.startX = e.nativeEvent.pageX;
              this.startY = e.nativeEvent.pageY;
              this.started = true;
            }}
            onTouchMove={(e) => {
              if (!this.started)
                return;

              const dx = e.nativeEvent.pageX - this.startX;
              const dy = e.nativeEvent.pageY - this.startY;

              if (Math.abs(dx) >= 10) {
                if (dx < 0) {
                  this.refPropsContainer.current.offsetX(-dx);
                  this.context.slideMoving = true;
                }
              }
            }}
            onTouchEnd={() => {
              this.refPropsContainer.current.release();
              this.started = false;
            }}
            onTouchCancel={() => {
              this.refPropsContainer.current.release();
              this.started = false;
            }}
          />
        </View>
        <FooterContainer>
          <View style={styles.bannerStyle}>
            <TextButton title='目录' />
            <TextButton title='夜间' />
            <TextButton title='设置' onPress={() => {
              DeviceEventEmitter.emit(EventKeys.ARTICLE_PAGE_HIDE_BANNER);
              const key = RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
            }} />
          </View>
        </FooterContainer>
        <Drawer ref={this.refPropsContainer}>
          <ReaderTab attrsConfig={attrsConfig} />
          {/* {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>} */}
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
  tabDrawer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  tabContainer: {
    width: "18%",
    height: "100%",
  },
  contentContainer: {
    width: "80%",
    height: "100%",
    backgroundColor: "#a49f99"
  }
});

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);
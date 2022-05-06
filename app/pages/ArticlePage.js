
import React from 'react';

import {
  connect,
  Component,
  StyleSheet,
  action,
  EventKeys,
  AppDispath
} from "../constants";

import { 
  View,
  Text,
  FlatList,
} from '../constants/native-ui';

import Block from '../components/article';
import { DeviceEventEmitter, Animated } from 'react-native';
import { CarouselUtils } from '../components/carousel';
import { TextButton } from '../constants/custom-ui';
import RootView from '../components/RootView';
import ReaderSettings from '../components/readerSettings';

const data = [
  {
    title: "现实",
    body: "现实场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/11/200/300",
    toChapter: "WZXX_M1_N1_C001",
  },
  {
    title: "灵修",
    body: "灵修场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/10/200/300",
    toChapter: "WZXX_M1_N1_C002",
  },
  {
    title: "尘界",
    body: "尘界场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/12/200/300",
    toChapter: "WZXX_M1_N1_C003",
  },
];

const worldSelector = () => {
  CarouselUtils.show({ 
    data, 
    initialIndex: Math.floor(data.length / 2), 
    onSelect: (p) => {
      if (p.item.toChapter != undefined) {
        AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: p.item.toChapter, __sceneId: '' } });
      }
    }
  });
}

const Header = (props) => {
  const maxHeight = 100;
  const [display, setDisplay] = React.useState(false);
  const status = React.useRef({ animating: false, closing: false }).current;
  const switcAnimation = React.useRef(null);
  const posBottom = React.useRef(new Animated.Value(display ? 0 : -maxHeight)).current;

  React.useEffect(() => {
    // 点击滑出
    const pressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_PRESS, (e) => {
      if (status.animating)
        return; // 动画进行中，禁止重入。

      status.animating = true;
      const animation = Animated.timing(posBottom, {
        toValue: display ? -maxHeight : 0,
        duration: 350,
        useNativeDriver: false,
      });
      animation.start(() => {
        setDisplay((v) => !v);
        status.animating = false;
      });
      switcAnimation.current = animation;
    });

    // 文章滑动时隐藏
    const scrollListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_SCROLL, (e) => {
      // 停止正在播放的动画
      if (status.animating && switcAnimation.current != null) {
        switcAnimation.current.stop();
        switcAnimation.current = null;
        status.closing = false;
      }

      // 隐藏功能区
      if (display && status.closing == false) {
        status.closing = true;
        const animation = Animated.timing(posBottom, {
          toValue: -maxHeight,
          duration: 350,
          useNativeDriver: false,
        });
        animation.start(() => {
          setDisplay(false);
          status.closing = false;
          status.animating = false;
        });
      }
    });
    return () => {
      pressListener.remove();
      scrollListener.remove();
    };
  }, [display]);
  return (
    <Animated.View style={{ position: 'absolute', left: 0, top: posBottom, zIndex: 100, width: '100%', height: maxHeight, backgroundColor: '#a49f99' }}>
      {props.children}
    </Animated.View>
  );
}

const Footer = (props) => {
  const maxHeight = 100;
  const [display, setDisplay] = React.useState(false);
  const status = React.useRef({ animating: false, closing: false }).current;
  const switcAnimation = React.useRef(null);
  const posBottom = React.useRef(new Animated.Value(display ? 0 : -maxHeight)).current;

  React.useEffect(() => {
    // 点击滑出
    const pressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_PRESS, (e) => {
      if (status.animating)
        return; // 动画进行中，禁止重入。

      status.animating = true;
      const animation = Animated.timing(posBottom, {
        toValue: display ? -maxHeight : 0,
        duration: 350,
        useNativeDriver: false,
      });
      animation.start(() => {
        setDisplay((v) => !v);
        status.animating = false;
      });
      switcAnimation.current = animation;
    });

    // 文章滑动时隐藏
    const scrollListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_SCROLL, (e) => {
      // 停止正在播放的动画
      if (status.animating && switcAnimation.current != null) {
        switcAnimation.current.stop();
        switcAnimation.current = null;
        status.closing = false;
      }

      // 隐藏功能区
      if (display && status.closing == false) {
        status.closing = true;
        const animation = Animated.timing(posBottom, {
          toValue: -maxHeight,
          duration: 350,
          useNativeDriver: false,
        });
        animation.start(() => {
          setDisplay(false);
          status.closing = false;
          status.animating = false;
        });
      }
    });
    return () => {
      pressListener.remove();
      scrollListener.remove();
    };
  }, [display]);
  return (
    <Animated.View style={{ position: 'absolute', left: 0, bottom: posBottom, zIndex: 100, width: '100%', height: maxHeight, backgroundColor: '#a49f99' }}>
      {props.children}
    </Animated.View>
  );
}

class ArticlePage extends Component {

  constructor(props) {
    super(props);
    this.refList = React.createRef();
    this.longPressListener = null;
  }

  componentDidMount() {
    this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));

    // 长按监听器
    this.longPressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_LONG_PRESS, (e) => {
      worldSelector();
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
    return (
        <View style={styles.viewContainer}>
          <Header>
            <View style={[styles.bannerStyle, { marginTop: 20, }]}>
              <TextButton title='X' />
              <TextButton title='选择世界' onPress={worldSelector} />
              <TextButton title='...' />
            </View>
          </Header>
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
            />
          </View>
          <Footer>
            <View style={styles.bannerStyle}>
              <TextButton title='目录' />
              <TextButton title='夜间' />
              <TextButton title='设置' onPress={()=>{
                const key =RootView.add(<ReaderSettings onClose={() => { RootView.remove(key) }} />)
              }} />
            </View>
          </Footer>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: "flex-start", 
    backgroundColor: "#eee7dd"
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

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);
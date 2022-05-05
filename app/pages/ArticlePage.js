
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
  FlatList,
} from '../constants/native-ui';

import Block from '../components/article';
import { DeviceEventEmitter } from 'react-native';
import { CarouselUtils } from '../components/carousel';

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

class ArticlePage extends Component {

  constructor(props) {
    super(props);
    this.refList = React.createRef();
    this.longPressListener = null;
  }

  componentDidMount() {
    this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));
    this.longPressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_LONG_PRESS, (e) => {
      // 测试代码...
      CarouselUtils.show({ 
        data, 
        initialIndex: Math.floor(data.length / 2), 
        onSelect: (p) => {
          if (p.item.toChapter != undefined) {
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: p.item.toChapter, __sceneId: '' } });
          }
        }
      });
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

  renderItem = (data) => {
    return (<Block data={data.item} />);
  }

  viewableItemsChangedhandler = (payload) => {
  }

  scrollHandler = (payload) => {
    this.props.dispatch(action('ArticleModel/scroll')({ 
      offsetX: payload.nativeEvent.contentOffset.x,
      offsetY: payload.nativeEvent.contentOffset.y,
    }));
  }

  endReachedHandler = () => {
    this.props.dispatch(action('ArticleModel/end')({}));
  }

  render() {
    return (
        <View style={styles.viewContainer}>
          <View style={styles.topBarContainer}>
          </View>
          <View style={styles.bodyContainer}>
            <FlatList
              ref={this.refList}
              data={this.props.sections}
              renderItem={this.renderItem}
              keyExtractor={item => item.key}
              onViewableItemsChanged={this.viewableItemsChangedhandler}
              onScroll={this.scrollHandler}
              onEndReached={this.endReachedHandler}
              initialNumToRender={2}
              maxToRenderPerBatch={5}
            />
          </View>
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
  // floatContainer: {
  //   position: 'absolute',
  //   left: 0,
  //   top: 200,
  //   width: '100%',
  //   height: '100%',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
});

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);
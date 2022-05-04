
import React from 'react';

import {
  connect,
  Component,
  StyleSheet,
  action
} from "../constants";

import { 
  View,
  Text,
  FlatList,
  Image,
} from '../constants/native-ui';

import Block from '../components/article';
import { Animated, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel'

const data = [
  {
    title: "现实",
    body: "现实场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/11/200/300",
  },
  {
    title: "灵修界",
    body: "灵修场景，这里添加更多描述 ",
    imgUrl: "https://picsum.photos/id/10/200/300",
  },
  {
    title: "尘界",
    body: "尘界场景，这里添加更多描述",
    imgUrl: "https://picsum.photos/id/12/200/300",
  },
];

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles2.container} key={index}>
      <Image
        source={{ uri: item.imgUrl }}
        style={styles2.image}
      />
      <Text style={styles2.header}>{item.title}</Text>
      <Text style={styles2.body}>{item.body}</Text>
    </View>
  )
}

const CarouselCards = () => {
  const isCarousel = React.useRef(null)

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        layout="default"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={false}
      />
    </View>
  )
}

class SlideWorld extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ position: 'absolute', top: 150, width: '100%', height: 550, backgroundColor: '#eee' }}>
        <CarouselCards />
      </View>
    );
  }

}

class ArticlePage extends Component {

  constructor(props) {
    super(props);
    this.refList = React.createRef();
    this.funcAreaRefTop = new Animated.Value(200);
    this.funcAreaMoving = false;
    this.funcAreaShow = false;
  }

  componentDidMount() {
    this.props.dispatch(action('ArticleModel/show')({ file: 'WZXX_[START]' }));
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

  pageTouchHandler = () => {
    if (!this.funcAreaMoving) {
      this.funcAreaMoving = true;
      const toValue = this.funcAreaShow ? 200 : 0;
      Animated.timing(this.funcAreaRefTop, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: false,
      }).start((r) => {
        this.funcAreaMoving = false;
        this.funcAreaShow = !this.funcAreaShow;
      });
    }
  }

  render() {
    return (
      // <TouchableWithoutFeedback onPress={this.pageTouchHandler}>
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
          <SlideWorld />
          {/* <View style={styles.debugContainer} pointerEvents="box-none" >
            <View style={{ borderWidth: 1, borderColor: '#999', width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5, backgroundColor: '#ccc' }} pointerEvents="box-none">
              <Text>事件触发区域</Text>
            </View>
          </View> */}
          {/* <Animated.View style={[styles.floatContainer, { top: this.funcAreaRefTop }]} pointerEvents='none'>
              <View style={{ borderWidth: 1, borderColor: '#999', width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.75, backgroundColor: '#d9c7b4' }} pointerEvents="box-none">
                <Text>阅读器功能区域</Text>
              </View>
          </Animated.View> */}
        </View>
      // </TouchableWithoutFeedback>
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

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: 300,
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20
  }
})

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);
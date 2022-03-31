
import React from 'react';

import {
  RenderHTML
} from 'react-native-render-html';

import {
  connect,
  Component,
  StyleSheet,
  getWindowSize,
  ScrollView,
  action
} from "../constants";

import * as RootNavigation from '../utils/RootNavigation'
import { 
  Button, 
  Text, 
  View,
  FlatList,
} from '../constants/native-ui';

import Block from '../components/article';

class ArticlePage extends Component {

  constructor(props) {
    super(props);
    this.refList = React.createRef();
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
          />
        </View>
        {/* <View style={styles.debugContainer} pointerEvents="box-none" >
          <View style={{ borderWidth: 1, borderColor: '#999', width: '100%', height: 200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5, backgroundColor: '#ccc' }} pointerEvents="box-none">
            <Text>事件触发区域</Text>
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
  }
});

export default connect((state) => ({ ...state.ArticleModel }))(ArticlePage);
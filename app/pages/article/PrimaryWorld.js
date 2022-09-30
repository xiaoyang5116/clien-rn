import React from 'react';
import lo from 'lodash';

import { View, Text, Animated, StyleSheet, DeviceEventEmitter, FlatList } from 'react-native';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import WorldUnlockView from './WorldUnlockView';
import RootView from '../../components/RootView';
import { action, DataContext, EventKeys, getWindowSize } from '../../constants';
import { ARTICLE_FLATLIST_MARGIN_TOP } from "../../constants/custom-ui";
import PropTips from '../../components/tips/PropTips';
import TipsView from '../../components/article/TipsView';
import Block from '../../components/article';

const WIN_SIZE = getWindowSize();

const PrimaryWorld = (props) => {
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
  
        const uri = new URL(e.url);
        const params = new URLSearchParams(uri.searchParams);
        if (!lo.isNull(params.get('propId'))) {
          // 显示道具Tips
          const propId = parseInt(params.get('propId'));
          const key = RootView.add(<PropTips propId={propId} viewOnly={true} onClose={() => {
            RootView.remove(key);
          }} />);
          return;
        }
  
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
      <View style={[{ flex: 1 }, {  }]}>
        <FlatList
          style={{ alignSelf: 'stretch', marginTop: ARTICLE_FLATLIST_MARGIN_TOP }}
          ref={(ref) => refList.current = ref}
          data={props.sections}
          renderItem={(data) => <Block data={data.item} />}
          keyExtractor={item => item.key}
          onScroll={scrollHandler}
          onEndReached={endReachedHandler}
          initialNumToRender={30}
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

const styles = StyleSheet.create({
    tranSceneFontStyle: {
      fontSize: 24, 
      color: '#333',
    },
});  

export default PrimaryWorld;
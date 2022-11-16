
import React from 'react';

import {
  EventKeys, getWindowSize,
} from "../../constants";

import { DeviceEventEmitter, Animated } from 'react-native';

const WIN_SIZE = getWindowSize();

const HeaderContainer = (props) => {
    const [display, setDisplay] = React.useState(false);
    const maxHeight = React.useRef(0);
    const status = React.useRef({ animating: false, closing: false, initLayout: false }).current;
    const switcAnimation = React.useRef(null);
    const posBottom = React.useRef(new Animated.Value(-WIN_SIZE.height / 2)).current;
  
    React.useEffect(() => {
      // 点击滑出
      const pressListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_PRESS, (e) => {
        if (status.animating)
          return; // 动画进行中，禁止重入。
  
        status.animating = true;
        const animation = Animated.timing(posBottom, {
          toValue: display ? -maxHeight.current : 0,
          duration: 350,
          useNativeDriver: false,
        });
        animation.start(() => {
          setDisplay((v) => !v);
          status.animating = false;
        });
        switcAnimation.current = animation;
      });
  
      const closeHandler = (e) => {
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
            toValue: -maxHeight.current,
            duration: 350,
            useNativeDriver: false,
          });
          animation.start(() => {
            setDisplay(false);
            status.closing = false;
            status.animating = false;
          });
        }
      };
  
      // 文章滑动时隐藏
      const scrollListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_SCROLL, closeHandler);
      // 主动关闭(接收消息)
      const activeListener = DeviceEventEmitter.addListener(EventKeys.ARTICLE_PAGE_HIDE_BANNER, closeHandler);
  
      return () => {
        pressListener.remove();
        scrollListener.remove();
        activeListener.remove();
      };
    }, [display]);

    const layoutHandler = (e) => {
      if (status.initLayout)
        return;

      const width = e.nativeEvent.layout.width;
      const height = e.nativeEvent.layout.height;
      maxHeight.current = height;
      posBottom.setValue(-height);
      status.initLayout = true;
    }

    return (
      <Animated.View style={{ position: 'absolute', left: 0, top: posBottom, zIndex: 100, width: '100%',  backgroundColor: '#cfdbe4' }} onLayout={layoutHandler}>
        {props.children}
      </Animated.View>
    );
}

export default HeaderContainer;

import React from 'react';

import {
  EventKeys,
} from "../../constants";

import { DeviceEventEmitter, Animated } from 'react-native';

const HeaderContainer = (props) => {
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
    return (
      <Animated.View style={{ position: 'absolute', left: 0, top: posBottom, zIndex: 100, width: '100%', height: maxHeight, backgroundColor: '#a49f99' }}>
        {props.children}
      </Animated.View>
    );
}

export default HeaderContainer;
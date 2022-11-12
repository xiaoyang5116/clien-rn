
import React from 'react';

import {
  StyleSheet,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';

import {
  action,
  connect,
  Component,
  EventKeys,
  DataContext,
  getWindowSize,
} from "../constants";

import {
  View,
  Text,
  SafeAreaView,
} from '../constants/native-ui';

import { ImageButton } from '../constants/custom-ui';
import * as RootNavigation from '../utils/RootNavigation';
import RootView from '../components/RootView';
import ArchivePage from './ArchivePage';
import MailBoxPage from './MailBoxPage';
import Modal from '../components/modal';
import Shock from '../components/shock';
import Drawer from '../components/drawer';
import Clues from '../components/cluesList';
import { playBGM } from '../components/sound/utils';
import WorshipModal from '../components/worship';
import { px2pd } from '../constants/resolution';
import FastImage from 'react-native-fast-image';

const BTN_STYLE = {
  width: px2pd(680),
  height: px2pd(150),
}

const FirstPage = (props) => {

  const dataContext = React.useContext(DataContext);
  const refDrawer = React.createRef();
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const started = React.useRef(false);

  const [logoPosY, setLogoPosY] = React.useState(0);

  React.useEffect(() => {
    DeviceEventEmitter.emit(EventKeys.NAVIGATION_ROUTE_CHANGED, { routeName: 'First' });
  }, []);

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;

    // 设置LOGO位置
    const WIN_SIZE = getWindowSize();
    const LOGO_HEIGHT = 309;
    const offsetY = (WIN_SIZE.height / 2) - (height / 2) - px2pd(LOGO_HEIGHT + 100);
    setLogoPosY(offsetY);
  }

  return (
    <View style={{ flex: 1 }}
      onTouchStart={(e) => {
        if (e.nativeEvent.pageX > 40)
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
        if (Math.abs(dx) >= 5) {
          if (dx > 0) refDrawer.current.offsetX(dx);
        }
      }}
      onTouchEnd={(e) => {
        refDrawer.current.release();
        started.current = false;
      }}
      onTouchCancel={(e) => {
        refDrawer.current.release();
        started.current = false;
      }}>
      {/* 背景图片 */}
      <ImageBackground style={styles.bgContainer} source={require('../../assets/bg/first_page.webp')}>
        {/* LOGO */}
        <View style={{ position: 'absolute', top: logoPosY }}>
          <FastImage style={{ width: px2pd(766), height: px2pd(309) }} source={require('../../assets/bg/logo_big.png')} />
        </View>
        <View style={styles.viewContainer}>
          <View onLayout={onLayout}>
            {/* 开始剧情 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/story_button.png')} selectedSource={require('../../assets/button/story_button_selected.png')} onPress={() => {
              RootNavigation.navigate('Article');
            }} />
            {/* 继续阅读 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
              dataContext.continueReading = true;
              RootNavigation.navigate('Article');
            }} />
            {/* 读取存档 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/archive_button.png')} selectedSource={require('../../assets/button/archive_button_selected.png')} onPress={() => {
              const key = RootView.add(<ArchivePage onClose={() => {
                RootView.remove(key);
              }} />);
            }} />
            {/* 用户设置 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/profile_button.png')} selectedSource={require('../../assets/button/profile_button_selected.png')} onPress={() => {
              RootNavigation.navigate('Home', {
                screen: 'Profile',
              });
            }} />
            {/* 书城 */}
            <ImageButton {...BTN_STYLE} source={require('../../assets/button/quit_read.png')} selectedSource={require('../../assets/button/quit_read_selected.png')} onPress={() => {
              RootNavigation.navigate('BookMain');
            }} />
          </View>
        </View>
        <Drawer ref={refDrawer} direction={'left'} margin={60} style={{ backgroundColor: '#a49f99', borderRadius: 10, overflow: 'hidden' }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ fontSize: 28, color: '#666', marginBottom: 20 }}>测试菜单</Text>
              {/* 乞丐开局 */}
              <ImageButton {...BTN_STYLE} source={require('../../assets/button/home_button.png')} selectedSource={require('../../assets/button/home_button_selected.png')} onPress={() => {
                props.dispatch(action('StoryModel/enter')({ sceneId: 'wzkj' }));
              }} />
              {/* 继续阅读 */}
              <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
                props.dispatch(action('StoryModel/reEnter')({}));
              }} />
              {/* 线索 */}
              <ImageButton {...BTN_STYLE} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => {
                Clues.show();
              }} />
              {/* 测试按钮 */}
              <ImageButton {...BTN_STYLE} source={require('../../assets/button/test_button.png')} selectedSource={require('../../assets/button/test_button_selected.png')} onPress={() => {
                props.dispatch(action('StoryModel/enter')({ sceneId: 'test_scenes' }));
              }} />
            </View>
          </SafeAreaView>
        </Drawer>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
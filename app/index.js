/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  Animated,
  AppRegistry,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'  // 启动页插件
import { SafeAreaProvider } from 'react-native-safe-area-context';  // React Native Elements
import { hideNavigationBar } from 'react-native-navigation-bar-color';

import {
  dva_create,
  Provider,
  Component,
  StyleSheet,
  ThemeContext,
  currentTheme,
  EventKeys,
  DataContext,
  setReaderMode,
  statusBarHeight
} from './constants';

import lo from 'lodash';
import { name as appName } from '../app.json';
import { View, Text, Image } from './constants/native-ui';
import MainPage from './pages/MainPage';
import Shock from './components/shock'
import RootView from './components/RootView';
import EventListeners from './utils/EventListeners';
import FastImage from 'react-native-fast-image';
import { images } from './constants/preload';
import SoundProvider from './components/sound';

function preloadImages(images) {
  const uris = images.map(image => ({
    uri: Image.resolveAssetSource(image).uri
  }));

  FastImage.preload(uris);
};

preloadImages(images);

const models = [
  require('./models/AppModel').default,
  require('./models/UserModel').default,
  require('./models/SceneModel').default,
  require('./models/StoryModel').default,
  require('./models/MaskModel').default,
  require('./models/PropsModel').default,
  require('./models/ComposeModel').default,
  require('./models/ChallengeModel').default,
  require('./models/ArenaModel').default,
  require('./models/ArticleModel').default,
  require('./models/FigureModel').default,
  require('./models/MailBoxModel').default,
  require('./models/LotteryModel').default,
  require('./models/ExploreModel').default,
  require('./models/CluesModel').default,
  require('./models/SoundModel').default,
  require('./models/CollectModel').default,
  require('./models/PlantModel').default,
  require('./models/TreasureChestModel').default,
  require('./models/DropsModel').default,
  require('./models/ShopModel').default,
];

const defaultDataContext = {
  readerTextOpacity: new Animated.Value(1),
  readerBgImgOpacity: new Animated.Value(0.2),
}

const ActionHook = ({ dispatch, getState }) => next => action => {
  next(action);

  // 打印日志
  if (action.type.indexOf('@@') == -1) {
    const kv = { type: action.type };
    if (action.payload) kv.payload = action.payload;
    console.debug('Dva Action: ', kv);
  }
}

const ErrorHook = (e) => {
  console.error(e);
}

const dva = dva_create({
  onError: ErrorHook,
  // onAction: ActionHook,
});

// DEV环境下刷新时清空已有监听器
EventListeners.removeAllListeners();

models.forEach((o) => {
  dva.model(o);
});
dva.start();

class LoadingPage extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      txt: 'Loading',
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ txt: this.state.txt + '.' });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <View style={styles.loadingPage}>
        <Text style={styles.loadingText}>{this.state.txt}</Text>
      </View>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      themeStyle: null,
    };
    this.listeners = [];
  }

  componentDidMount() {
    // 隐藏安卓底部导航栏
    hideNavigationBar();

    // 注册事件监听
    this.listeners.push(DeviceEventEmitter.addListener(EventKeys.APP_SET_STATE, (payload) => {
      this.setState({ ...payload });
    }));

    // 注册导航栏切换事件监听
    this.listeners.push(DeviceEventEmitter.addListener(EventKeys.NAVIGATION_ROUTE_CHANGED, ({ routeName }) => {
      setReaderMode(lo.isEqual(routeName, 'Article'));
    }));

    // 触发reload事件加载基础数据
    EventListeners.raise('reload')
      .then(() => {
        DeviceEventEmitter.emit(EventKeys.APP_SET_STATE, {
          loading: false,
          themeStyle: currentTheme().style
        });
      });

    // 启动页
    if (Platform.OS == 'android') {
      SplashScreen.hide();
    }
  }

  componentWillUnmount() {
    this.listeners.forEach(e => e.remove());
    this.listeners.length = 0;
  }

  renderLoading() {
    return (
      <LoadingPage />
    );
  }

  renderBody() {
    return (
      <View style={styles.rootContainer}>
        <Shock>
          {/* 隐藏安卓底部导航栏后,顶部的状态栏高度消失 */}
          { (Platform.OS == 'android') ? <View style={{ height: statusBarHeight }} /> : <></>  }
          <View style={{ flex: 1 }}>
            <MainPage />
            <RootView />
          </View>
        </Shock>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaProvider>
        <Provider store={dva._store}>
          <SoundProvider />
          <ThemeContext.Provider value={this.state.themeStyle}>
            <DataContext.Provider value={defaultDataContext}>
              {(this.state.loading) ? this.renderLoading() : this.renderBody()}
            </DataContext.Provider>
          </ThemeContext.Provider>
        </Provider>
      </SafeAreaProvider>
    );
  }

}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingPage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee7dd',
  },
  loadingText: {
    fontSize: 24,
    color: '#666',
  },
});

export default App;
AppRegistry.registerComponent(appName, () => App);
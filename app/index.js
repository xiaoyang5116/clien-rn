/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  AppRegistry,
  DeviceEventEmitter,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'  // 启动页插件

import {
  dva_create,
  Provider,
  Component,
  StyleSheet,
  ThemeContext,
  currentTheme,
} from './constants';

import { name as appName } from '../app.json';
import { View, Text, Image } from './constants/native-ui';
import MainPage from './pages/MainPage';
import RootView from './components/RootView';
import Shock from './components/shock'
import EventListeners from './utils/EventListeners';
import FastImage from 'react-native-fast-image';
import { images } from './constants/preload';
import * as Themes from './themes';

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
];

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

EventListeners.raise('reload')
.then(() => {
  DeviceEventEmitter.emit('App.setState', { loading: false });
});

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
      themeStyle: currentTheme().style,
    };
    this.listener = null;
  }
  
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('App.setState', (payload) => {
      this.setState({ ...payload });
    });
    SplashScreen.hide();  // 隐藏安卓启动页
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  renderLoading() {
    return (
      <LoadingPage />
    );
  }

  renderBody() {
    return (
      <Provider store={dva._store}>
        <ThemeContext.Provider value={this.state.themeStyle}>
          <View style={styles.rootContainer}>
            <Shock>
              <MainPage />
              <RootView />
            </Shock>
          </View>
        </ThemeContext.Provider>
      </Provider>
    );
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading();
    } else {
      return this.renderBody();
    }
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
  },
});

export default App;
AppRegistry.registerComponent(appName, () => App);
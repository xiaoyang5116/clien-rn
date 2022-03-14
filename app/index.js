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
  View,
} from 'react-native';

import { name as appName } from '../app.json';
import { Provider, dva_create, Component } from './constants';
import MainPage from './pages/MainPage';
import RootView from './components/tooltip/RootView';

const models = [
  require('./models/AppModel').default,
  require('./models/UserModel').default,
  require('./models/SceneModel').default,
  require('./models/StoryModel').default,
  require('./models/MaskModel').default,
];

const dva = dva_create();
models.forEach((o) => {
  dva.model(o);
});
dva.start();

class App extends Component {
  render() {
    return (
      <Provider store={dva._store}>
        <View style={{
          flex: 1,
          position: 'relative',
        }}>
          <MainPage />
          <RootView />
        </View>
      </Provider>
    );
  }
}

export default App;
AppRegistry.registerComponent(appName, () => App);
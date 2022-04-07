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
} from 'react-native';

import {
  dva_create,
  Provider,
  Component,
  StyleSheet
} from './constants';

import { name as appName } from '../app.json';
import { View } from './constants/native-ui';
import MainPage from './pages/MainPage';
import RootView from './components/RootView';
import Shock from './components/shock'

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
        <View style={styles.rootContainer}>
          <Shock>
            <MainPage />
            <RootView />
          </Shock>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
});

export default App;
AppRegistry.registerComponent(appName, () => App);
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  View,
  AppRegistry
} from 'react-native';

import { name as appName } from '../app.json';
import { Provider, dva_create } from './constants';

import AppModel from './models/AppModel';
import HomePage from './pages/HomePage';

const models = [AppModel];

const dva = dva_create();
models.forEach((o) => {
  dva.model(o);
});
dva.start();

const store = dva._store;

const App = () => {
  return (
    <Provider store={store}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <HomePage />
      </View>
    </Provider>
  );
}

export default App;
AppRegistry.registerComponent(appName, () => App);
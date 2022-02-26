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
import StoryModel from './models/StoryModel';
import DialogModel from './models/DialogModel';
import AsideModel from './models/AsideModel';

import MainPage from './pages/MainPage';

const models = [AppModel, StoryModel, DialogModel, AsideModel];

const dva = dva_create();
models.forEach((o) => {
  dva.model(o);
});
dva.start();

const store = dva._store;

const App = () => {
  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
}

export default App;
AppRegistry.registerComponent(appName, () => App);

import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import {
  connect,
  Component
} from '../constants';

import HomePage from './/HomePage';
import ArticlePage from './ArticlePage';
import FirstPage from './FirstPage';
import FictionPage from './FictionPage';
import GameOverPage from './GameOverPage';

import { navigationRef } from '../utils/RootNavigation';

const Stack = createNativeStackNavigator();

class MainPage extends Component {
  render() {
    return (
      <NavigationContainer theme={{ colors: this.props.currentStyles.navigation }} ref={navigationRef}>
        <Stack.Navigator initialRouteName='Fiction'>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
          <Stack.Screen name='Article' options={{ headerShown: false }} component={ArticlePage} />
          <Stack.Screen name="First" options={{ headerShown: false }} component={FirstPage} />
          <Stack.Screen name="Fiction" options={{ headerShown: false }} component={FictionPage} />
          <Stack.Screen name="GameOver" options={{ headerShown: false }} component={GameOverPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect((state) => ({ ...state.AppModel }))(MainPage);
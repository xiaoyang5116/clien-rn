
import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import {
  action,
  connect,
  Component,
  DeviceEventEmitter,
} from '../constants';

import HomePage from './/HomePage';
import ArticlePage from './ArticlePage';
import FirstPage from './FirstPage';

import { navigationRef } from '../utils/RootNavigation';

const Stack = createNativeStackNavigator();

class MainPage extends Component {

  constructor(props) {
    super(props);
    // 全局dispath监听器
    this.dispatchListener = null;
  }

  componentDidMount() {
    this.dispatchListener = DeviceEventEmitter.addListener('App.dispatch', (params) => {
      this.props.dispatch(action(params.type)(params.payload));
    });
  }

  componentWillUnmount() {
    this.dispatchListener.remove();
  }

  render() {
    return (
      <NavigationContainer theme={{ colors: this.props.currentStyles.navigation }} ref={navigationRef}>
        <Stack.Navigator initialRouteName='First'>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
          <Stack.Screen name='Article' options={{ headerShown: false }} component={ArticlePage} />
          <Stack.Screen name="First" options={{ headerShown: false }} component={FirstPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect((state) => ({ ...state.AppModel }))(MainPage);
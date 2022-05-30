
import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import { 
  createStackNavigator, 
  CardStyleInterpolators 
} from '@react-navigation/stack';

import {
  action,
  connect,
  Component,
  DeviceEventEmitter,
  EventKeys,
} from '../constants';

import lo from 'lodash';
import HomePage from './/HomePage';
import ArticlePage from './ArticlePage';
import NewArticlePage from './NewArticlePage';
import FirstPage from './FirstPage';
import SettingsPage from './SettingsPage';
import { navigationRef } from '../utils/RootNavigation';

const Stack = createStackNavigator();

class MainPage extends Component {

  constructor(props) {
    super(props);
    // 全局dispath监听器
    this.dispatchListener = null;
  }

  componentDidMount() {
    this.dispatchListener = DeviceEventEmitter.addListener(EventKeys.APP_DISPATCH, (params) => {
      this.props.dispatch(action(params.type)(params.payload)).then((result) => {
        if (lo.isFunction(params.cb)) params.cb(result);
      });
    });
  }

  componentWillUnmount() {
    this.dispatchListener.remove();
  }

  render() {
    return (
      <NavigationContainer theme={{ colors: this.props.currentStyles.navigation }} ref={navigationRef}>
        <Stack.Navigator initialRouteName='First' screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
          <Stack.Screen name='Article' options={{ headerShown: false }} component={NewArticlePage} />
          <Stack.Screen name="First" options={{ headerShown: false }} component={FirstPage} />
          <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect((state) => ({ ...state.AppModel }))(MainPage);
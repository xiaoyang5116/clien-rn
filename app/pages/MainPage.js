
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
import BookCityPage from './BookCityPage'
import { navigationRef } from '../utils/RootNavigation';
import { playBGM, playEffect } from '../components/sound/utils';

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

  // 导航栏切换至相应的页面
  stateChangeHandler = (state) => {
    let route = state.routes[state.index];
    if (lo.isEqual(route.name, 'Home')) {
      route = route.state.routes[route.state.index];
    }
    // 拦截导航栏所有跳转
    DeviceEventEmitter.emit(EventKeys.NAVIGATION_ROUTE_CHANGED, { routeName: route.name });
  }

  render() {
    return (
      <NavigationContainer theme={{ colors: this.props.currentStyles.navigation }} ref={navigationRef} onStateChange={this.stateChangeHandler}>
        <Stack.Navigator initialRouteName='First' screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
          <Stack.Screen name='Article' options={{ headerShown: false }} component={NewArticlePage} />
          <Stack.Screen name="First" options={{ headerShown: false }} component={FirstPage} />
          <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingsPage} />
          <Stack.Screen name="BookCity" options={{ headerShown: false }} component={BookCityPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect((state) => ({ ...state.AppModel }))(MainPage);
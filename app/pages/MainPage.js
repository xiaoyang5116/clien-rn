
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
  DataContext,
  DeviceEventEmitter,
  EventKeys,
} from '../constants';

import lo from 'lodash';
import HomePage from './/HomePage';
import ArticlePage from './ArticlePage';
import FirstPage from './FirstPage';
import SettingsPage from './SettingsPage';
import BookMainPage from './BookMainPage'
import { navigationRef } from '../utils/RootNavigation';
import { Appearance } from 'react-native';
import readerStyle from '../themes/readerStyle';
import ViewListeners from './ViewListeners';
import WorldUtils from '../utils/WorldUtils';

const Stack = createStackNavigator();

const MainPage = (props) => {

  const context = React.useContext(DataContext);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.APP_DISPATCH, (params) => {
      props.dispatch(action(params.type)(params.payload)).then((result) => {
        if (lo.isFunction(params.cb)) params.cb(result);
        if (lo.isString(params.retmsg)) DeviceEventEmitter.emit(params.retmsg, result);
      });
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.COLOR_SCHEME_CHANGED, (color) => {
      if (lo.isBoolean(props.darkLightSettings.app) && props.darkLightSettings.app) {
        if (lo.isEqual(color, 'dark')) {
          props.dispatch(action('AppModel/changeTheme')({ themeId: 2 }));
        } else if (lo.isEqual(color, 'light')) {
          props.dispatch(action('AppModel/changeTheme')({ themeId: 0 }));
        }
      }
      if (lo.isBoolean(props.darkLightSettings.reader) && props.darkLightSettings.reader) {
        if (lo.isEqual(color, 'dark')) {
          props.dispatch(action('ArticleModel/changeReaderStyle')(readerStyle.matchColor_7));
        } else if (lo.isEqual(color, 'light')) {
          props.dispatch(action('ArticleModel/changeReaderStyle')(readerStyle.matchColor_1));
        }
      }
    });
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      DeviceEventEmitter.emit(EventKeys.COLOR_SCHEME_CHANGED, colorScheme);
    })
    return () => {
      listener.remove();
    }
  }, []);

  React.useEffect(() => {
    context.currentWorldName = WorldUtils.getWorldNameById(props.user.worldId);
    context.currentWorldId = props.user.worldId;
    const listener = DeviceEventEmitter.addListener(EventKeys.SET_CURRENT_WORLD, (e) => {
      props.dispatch(action('UserModel/setWorld')({ name: e.name }));
      context.currentWorldName = e.name;
      context.currentWorldId = WorldUtils.getWorldIdByName(e.name);
    });
    return () => {
      listener.remove();
    }
  }, []);

  // 导航栏切换至相应的页面
  const stateChangeHandler = (state) => {
    let route = state.routes[state.index];
    if (lo.isEqual(route.name, 'Home')) {
      route = route.state.routes[route.state.index];
    }
    
    // 拦截导航栏所有跳转
    DeviceEventEmitter.emit(EventKeys.NAVIGATION_ROUTE_CHANGED, { routeName: route.name });
  }

  return (
    <NavigationContainer theme={{ colors: props.currentStyles.navigation }} ref={navigationRef} onStateChange={stateChangeHandler}>
      <Stack.Navigator initialRouteName='First' screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
        <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
        <Stack.Screen name='Article' options={{ headerShown: false }} component={ArticlePage} />
        <Stack.Screen name="First" options={{ headerShown: false }} component={FirstPage} />
        <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingsPage} />
        <Stack.Screen name="BookMain" options={{ headerShown: false }} component={BookMainPage} />
      </Stack.Navigator>
      <ViewListeners />
    </NavigationContainer>
  );
}

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(MainPage);
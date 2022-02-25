
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

import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';

const Stack = createNativeStackNavigator();

class MainPage extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' options={{ headerShown: false }} component={HomePage} />
          <Stack.Screen name='Article' options={{ headerShown: false }} component={ArticlePage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(({ AppModel }) => ({ ...AppModel }))(MainPage);
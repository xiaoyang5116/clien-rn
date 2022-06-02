
import React from 'react';

import {
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack';

import AppearancePage from './settings/AppearancePage';
import SoundSettings from './settings/SoundSettings';

const Stack = createStackNavigator();

const SettingsPage = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
      <Stack.Screen name='Appearance' options={{ headerShown: false }} component={AppearancePage} />
      <Stack.Screen name='Sound' options={{ headerShown: false }} component={SoundSettings} />
    </Stack.Navigator>
  );
}

export default SettingsPage;
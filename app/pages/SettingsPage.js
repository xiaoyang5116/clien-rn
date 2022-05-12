
import React from 'react';

import { 
  createStackNavigator, 
  CardStyleInterpolators 
} from '@react-navigation/stack';

import AppearancePage from './settings/AppearancePage';

const Stack = createStackNavigator();

const SettingsPage = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
      <Stack.Screen name='Appearance' options={{ headerShown: false }} component={AppearancePage} />
    </Stack.Navigator>
  );
}

export default SettingsPage;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppearancePage from './settings/AppearancePage';

const Stack = createNativeStackNavigator();

const SettingsPage = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Appearance' options={{ headerShown: false }} component={AppearancePage} />
    </Stack.Navigator>
  );
}

export default SettingsPage;
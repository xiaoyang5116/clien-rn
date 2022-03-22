import React from 'react';

import {
    Component,
} from "../../constants";

import {
    createNativeStackNavigator
} from '@react-navigation/native-stack';

import ComposeMainTabPage from './ComposeMainTabPage';
import ComposeDetailTabPage from './ComposeDetailTabPage';

const Stack = createNativeStackNavigator();

export default class ComposeTabPage extends Component {
    render() {
        return (
        <Stack.Navigator initialRouteName='ComposeMain'>
          <Stack.Screen name='ComposeMain' options={{ headerShown: false }} component={ComposeMainTabPage} />
          <Stack.Screen name='ComposeDetail' options={{ headerShown: false }} component={ComposeDetailTabPage} />
        </Stack.Navigator>
        );
    }
}
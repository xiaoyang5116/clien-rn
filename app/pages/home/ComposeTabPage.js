import React from 'react';

import {
    Component,
} from "../../constants";

import {
    NavigationContainer
  } from '@react-navigation/native';

import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';

import {
    View
} from '../../constants/native-ui';

import ComposeMainTabPage from './compose/ComposeMainTabPage';
import ComposeDetailTabPage from './compose/ComposeDetailTabPage';

const Stack = createStackNavigator();

export default class ComposeTabPage extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='ComposeMain' screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
                        <Stack.Screen name='ComposeMain' options={{ headerShown: false }} component={ComposeMainTabPage} />
                        <Stack.Screen name='ComposeDetail' options={{ headerShown: false }} component={ComposeDetailTabPage} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        );
    }
}
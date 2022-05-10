import React from 'react';

import {
    Component,
} from "../../constants";

import {
    createNativeStackNavigator
} from '@react-navigation/native-stack';

import {
    View
} from '../../constants/native-ui';

import { Panel } from '../../components/panel';
import ComposeMainTabPage from './compose/ComposeMainTabPage';
import ComposeDetailTabPage from './compose/ComposeDetailTabPage';

const Stack = createNativeStackNavigator();

export default class ComposeTabPage extends Component {
    render() {
        return (
        <Panel patternId={3}>
            <View style={{ flex: 1 }}>
                <Stack.Navigator initialRouteName='ComposeMain'>
                <Stack.Screen name='ComposeMain' options={{ headerShown: false }} component={ComposeMainTabPage} />
                <Stack.Screen name='ComposeDetail' options={{ headerShown: false }} component={ComposeDetailTabPage} />
                </Stack.Navigator>
            </View>
        </Panel>
        );
    }
}
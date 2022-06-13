import { View, Text } from 'react-native'
import React from 'react'

import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';

import {
    connect,
    Component,
    StyleSheet,
    ThemeContext,
} from "../constants";
import BookDetailPage from './book/BookDetailPage'
import BookCityPage from './book/bookCity'
import StartReadPage from './book/StartReadPage'

const Stack = createStackNavigator();

const BookMainPage = (props) => {
    return (
        <Stack.Navigator initialRouteName='BookCity' screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
            <Stack.Screen name='BookCity' options={{ headerShown: false }} component={BookCityPage} />
            <Stack.Screen name='BookDetail' options={{ headerShown: false }} component={BookDetailPage} />
            <Stack.Screen name='StartRead' options={{ headerShown: false }} component={StartReadPage} />
        </Stack.Navigator>
    )
}


export default BookMainPage
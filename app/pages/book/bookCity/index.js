import { View, Text } from 'react-native'
import React from 'react'
import {
    createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import BookCityHome from './home'


const Tab = createBottomTabNavigator();

const defaultScreenOptions = {
    tabBarStyle: {
        height: 70,
        borderTopWidth: 0, // 去掉底部边框
        backgroundColor: '#fff',
    },
    tabBarInactiveTintColor: '#666',
}

const BookCityPage = (props) => {
    return (
        <Tab.Navigator initialRouteName='首页' screenOptions={defaultScreenOptions}>
            <Tab.Screen name="首页" component={BookCityHome} options={{ headerShown: false, tabBarIcon: ({ color }) => (<AntDesign name='book' size={30} color={color} />), }} />
            <Tab.Screen name="广场" component={BookCityHome} options={{ headerShown: false, tabBarIcon: ({ color }) => (<AntDesign name='shoppingcart' size={30} color={color} />), }} />
            <Tab.Screen name="消息" component={BookCityHome} options={{ headerShown: false, tabBarIcon: ({ color }) => (<AntDesign name='lock1' size={30} color={color} />), }} />
            <Tab.Screen name="我的" component={BookCityHome} options={{ headerShown: false, tabBarIcon: ({ color }) => (<AntDesign name='lock1' size={30} color={color} />), }} />
        </Tab.Navigator>
    )
}

export default BookCityPage
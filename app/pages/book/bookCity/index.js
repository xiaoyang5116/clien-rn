import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {
    createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

import BookCityHome from './home'


const Tab = createBottomTabNavigator();

const TabIcon = (props) => {
    return (
        <View style={styles.tabIconContainer}>
            <AntDesign name={props.iconName} size={30} color={props.color} />
            <Text style={[styles.tabIconText, { color: props.color }]}>{props.title}</Text>
        </View>
    )
}

const defaultScreenOptions = {
    headerShown: false,
    tabBarStyle: {
        height: 70,
        padding: 0,
        borderTopWidth: 0, // 去掉底部边框
        backgroundColor: '#fff',
    },
    tabBarInactiveTintColor: '#666',
}

const BookCityPage = (props) => {
    return (
        <Tab.Navigator initialRouteName='首页' screenOptions={defaultScreenOptions}>
            <Tab.Screen name="首页" component={BookCityHome} options={{
                tabBarIcon: ({ color }) => (<TabIcon color={color} title={"首页"} iconName={"book"} />),
                tabBarLabel: "",
            }} />
            <Tab.Screen name="广场" component={BookCityHome} options={{
                tabBarIcon: ({ color }) => (<TabIcon color={color} title={"广场"} iconName={"shoppingcart"} />),
                tabBarLabel: "",
            }} />
            <Tab.Screen name="消息" component={BookCityHome} options={{
                tabBarIcon: ({ color }) => (<TabIcon color={color} title={"消息"} iconName={"lock1"} />),
                tabBarLabel: "",
            }} />
            <Tab.Screen name="我的" component={BookCityHome} options={{
                tabBarIcon: ({ color }) => (<TabIcon color={color} title={"我的"} iconName={"lock1"} />),
                tabBarLabel: "",
            }} />
        </Tab.Navigator>
    )
}

export default BookCityPage

const styles = StyleSheet.create({
    tabIconContainer: {
        height: 70,
        width: "100%",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    tabIconText: {
        fontSize: 12,
    },
})
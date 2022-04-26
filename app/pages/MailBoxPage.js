import { View, Text } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNavigationContainerRef } from '@react-navigation/native';


import { HalfPanel } from '../components/panel';
import NewMailPage from './mail/NewMailPage';
import CompletedMailPage from './mail/CompletedMailPage';


const Tab = createBottomTabNavigator();

const defaultScreenOptions = {
    // headerTitleStyle: {
    //     color: '#666',
    // },

    // headerBackground: () => {
    //     return (
    //         <View style={{ marginTop: 45, backgroundColor: '#fff', width: '100%', height: 50 }}>
    //             <ImageCapInset
    //                 style={{ width: '100%', height: '100%' }}
    //                 source={require('../../assets/tab/tab_header_bg.png')}
    //                 capInsets={{ top: 25, right: 25, bottom: 25, left: 25 }}
    //             />
    //         </View>
    //     );
    // },
    // tabBarStyle: {
    //     height: 70,
    //     borderTopWidth: 0, // 去掉底部边框
    //     backgroundColor: '#fff',
    // },
    // tabBarBackground: () => {
    //     return (
    //         <FastImage style={{ position: 'absolute', left: 0, top: -20, width: '100%', height: '100%' }} resizeMode='contain' source={require('../../assets/tab/tab_banner_bg.png')} />
    //     );
    // },
}

const MailBoxPage = (props) => {
    return (
        <HalfPanel>
            <NavigationContainer>
                <Tab.Navigator initialRouteName='NewMail' screenOptions={defaultScreenOptions}>
                    <Tab.Screen name="NewMail" component={NewMailPage} options={{
                        tabBarLabel: "新信件",
                        // headerTitle: "新信件",
                        // tabBarIcon: ({ color }) => (<TabIcon color={color} title={'世界'} />),
                    }} />
                    <Tab.Screen name="CompletedMail" component={CompletedMailPage} options={{
                        tabBarLabel: "已完成",
                        // headerTitle: "已完成",
                        // tabBarIcon: ({ color }) => (<TabIcon color={color} title={'探索'} />),
                    }} />
                </Tab.Navigator>
            </NavigationContainer>
        </HalfPanel>
    )
}

export default MailBoxPage
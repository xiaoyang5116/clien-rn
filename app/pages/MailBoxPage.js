import { View, Text } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import MailPanel from './mail/MailPanel';


import NewMailPage from './mail/NewMailPage';
import CompletedMailPage from './mail/CompletedMailPage';



const MailBoxPage = (props) => {

    const [currentTab, setCurrentTab] = React.useState('NewMailPage');

    return (
        <MailPanel onClose={props.onClose}>
            <NewMailPage />
        </MailPanel>
    )
}

export default MailBoxPage
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TextButton } from '../../constants/custom-ui';
import {
    action,
    connect,
} from "../../constants";
import { changeAvatar } from '../../constants'
import RootView from '../RootView'
import Letter from './letter';


const CompletedLetter = () => {
    return (
        <View>
            <Text>completedLetter</Text>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(CompletedLetter)
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, PureComponent } from 'react';
import type {Node} from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  SectionList,
  useColorScheme,
  View,
  Dimensions,
  Alert,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { 
  NavigationContainer 
} from '@react-navigation/native';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import StoryPage from './modules/StoryPage';

const { width, height, scale, fontScale } = Dimensions.get('window');

const DetailsScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Details Screen
      </Text>
      <Button title='Go Home>>>' onPress={()=>navigation.navigate('tabWorld')} />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="tabWorld" component={StoryPage} options={{
          tabBarLabel: "世界",
          headerTitle: "世界",
        }} />
        <Tab.Screen name="tab2" component={DetailsScreen} options={{
          tabBarLabel: "活动",
          headerTitle: "活动",
        }} />
        <Tab.Screen name="tab3" component={StoryPage} options={{
          tabBarLabel: "技能",
          headerTitle: "技能",
        }} />
        <Tab.Screen name="tab4" component={DetailsScreen} options={{
          tabBarLabel: "商城",
          headerTitle: "商城",
        }} />
        <Tab.Screen name="tab5" component={StoryPage} options={{
          tabBarLabel: "我的",
          headerTitle: "我的",
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

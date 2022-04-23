
import React from 'react';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  connect,
  Component
} from "../constants";

import {
  View,
  Text,
} from '../constants/native-ui';

import StoryTabPage from './home/StoryTabPage';
import ProfileTabPage from './home/ProfileTabPage';
import PropsTabPage from './home/PropsTabPage';
import LotteryTabPage from './home/LotteryTabPage';
import ComposeTabPage from './home/ComposeTabPage';
import ArenaTabPage from './home/ArenaTabPage';
import ExploreTabPage from './home/ExploreTabPage';
import FastImage from 'react-native-fast-image';

const Tab = createBottomTabNavigator();

const TabIcon = (props) => {
  return (
    <View style={{  }}>
      <View style={{ borderWidth: 1, borderColor: '#ccc',  marginTop: 20, padding: 1, transform: [{ scale: 0.5 }] }}>
        <FastImage style={{ width: 56, height: 90 }} source={require('../../assets/tab_icon.png')} />
      </View>
      <View style={{ position: 'absolute', left: 25, top: 55, width: 20 }}>
        <Text style={{ fontSize: 12, color: props.color }}>{props.title}</Text>
      </View>
    </View>
  );
}

class HomePage extends Component {

  render() {
    return (
      <Tab.Navigator initialRouteName='World'>
        <Tab.Screen name="World" component={StoryTabPage} options={{
          tabBarLabel: "",
          headerTitle: "世界",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'世界'} />),
        }} />
        <Tab.Screen name="Explore" component={ExploreTabPage} options={{
          tabBarLabel: "",
          headerTitle: "探索",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'探索'} />),
        }} />
        <Tab.Screen name="Arena" component={ArenaTabPage} options={{
          tabBarLabel: "",
          headerTitle: "竞技",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'竞技'} />),
        }} />
        <Tab.Screen name="Compose" component={ComposeTabPage} options={{
          tabBarLabel: "",
          headerTitle: "制作",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'制作'} />),
        }} />
        <Tab.Screen name="Props" component={PropsTabPage} options={{
          tabBarLabel: "",
          headerTitle: "道具",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'道具'} />),
        }} />
        <Tab.Screen name="Lottery" component={LotteryTabPage} options={{
          tabBarLabel: "",
          headerTitle: "抽奖",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'抽奖'} />),
        }} />
        <Tab.Screen name="Profile" component={ProfileTabPage} options={{
          tabBarLabel: "",
          headerTitle: "我的",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'我的'} />),
        }} />
      </Tab.Navigator>
    );
  }
  
}

export default connect((state) => ({ ...state.AppModel }))(HomePage);
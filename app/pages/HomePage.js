
import React from 'react';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  connect,
  Component
} from "../constants";

import StoryTabPage from './home/StoryTabPage';
import ProfileTabPage from './home/ProfileTabPage';
import PropsTabPage from './home/PropsTabPage';
import LotteryTabPage from './home/LotteryTabPage';
import ComposeTabPage from './home/ComposeTabPage';
import ArenaTabPage from './home/ArenaTabPage';
import ExploreTabPage from './home/ExploreTabPage';

const Tab = createBottomTabNavigator();

class HomePage extends Component {

  render() {
    return (
      <Tab.Navigator initialRouteName='World'>
        <Tab.Screen name="World" component={StoryTabPage} options={{
          tabBarLabel: "世界",
          headerTitle: "世界",
        }} />
        <Tab.Screen name="Explore" component={ExploreTabPage} options={{
          tabBarLabel: "探索",
          headerTitle: "探索",
        }} />
        <Tab.Screen name="Arena" component={ArenaTabPage} options={{
          tabBarLabel: "竞技场",
          headerTitle: "竞技场",
        }} />
        <Tab.Screen name="Compose" component={ComposeTabPage} options={{
          tabBarLabel: "制作",
          headerTitle: "制作",
        }} />
        <Tab.Screen name="Props" component={PropsTabPage} options={{
          tabBarLabel: "道具",
          headerTitle: "道具",
        }} />
        <Tab.Screen name="Lottery" component={LotteryTabPage} options={{
          tabBarLabel: "抽奖",
          headerTitle: "抽奖",
        }} />
        <Tab.Screen name="Profile" component={ProfileTabPage} options={{
          tabBarLabel: "我的",
          headerTitle: "我的",
        }} />
      </Tab.Navigator>
    );
  }
  
}

export default connect((state) => ({ ...state.AppModel }))(HomePage);

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
import ArenaTabPage from './home/ArenaTabPage';

const Tab = createBottomTabNavigator();

class HomePage extends Component {

  render() {
    return (
      <Tab.Navigator>
      <Tab.Screen name="tabWorld" component={StoryTabPage} options={{
        tabBarLabel: "世界",
        headerTitle: "世界",
      }} />
      <Tab.Screen name="tab2" component={StoryTabPage} options={{
        tabBarLabel: "活动",
        headerTitle: "活动",
      }} />
      <Tab.Screen name="tab3" component={ArenaTabPage} options={{
        tabBarLabel: "竞技场",
        headerTitle: "竞技场",
      }} />
      <Tab.Screen name="tab4" component={PropsTabPage} options={{
        tabBarLabel: "道具",
        headerTitle: "道具",
      }} />
      <Tab.Screen name="tab5" component={ProfileTabPage} options={{
        tabBarLabel: "我的",
        headerTitle: "我的",
      }} />
      </Tab.Navigator>
    );
  }
  
}

export default connect((state) => ({ ...state.AppModel }))(HomePage);
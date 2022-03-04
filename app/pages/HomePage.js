
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
      <Tab.Screen name="tab3" component={StoryTabPage} options={{
        tabBarLabel: "技能",
        headerTitle: "技能",
      }} />
      <Tab.Screen name="tab4" component={StoryTabPage} options={{
        tabBarLabel: "商城",
        headerTitle: "商城",
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
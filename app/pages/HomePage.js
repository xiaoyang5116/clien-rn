
import React from 'react';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  connect,
  Component,
  StyleSheet,
} from "../constants";

import {
  View,
  Text,
} from '../constants/native-ui';

import FastImage from 'react-native-fast-image';
import ImageCapInset from 'react-native-image-capinsets-next';

import StoryTabPage from './home/StoryTabPage';
import ProfileTabPage from './home/ProfileTabPage';
import PropsTabPage from './home/PropsTabPage';
import LotteryTabPage from './home/LotteryTabPage';
import ComposeTabPage from './home/ComposeTabPage';
import ArenaTabPage from './home/ArenaTabPage';
import ExploreTabPage from './home/ExploreTabPage';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const TabIcon = (props) => {
  return (
    <View style={{ position: 'absolute', width: 30, height: 48, left: 12, top: -8, borderWidth: 1, borderColor: '#ccc' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, transform: [{ scale: 0.5 }] }}>
          <FastImage style={{ position: 'absolute', width: 56, height: 90 }} source={require('../../assets/tab/tab_icon.png')} />
        </View>
        <View style={{ position: 'absolute', left: 8, top: 10, width: 20 }}>
          <Text style={{ fontSize: 12, color: props.color }}>{props.title}</Text>
        </View>
    </View>
  );
}

const HeaderTitle = (props) => {
  return (
    <View style={[{ marginTop: (Platform.OS == 'android' ? 0 : 45),  height: 50, width: '100%', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
      <ImageCapInset
        style={{ width: '100%', height: '100%', position: 'absolute', }}
        source={require('../../assets/tab/tab_header_bg.png')}
        capInsets={{ top: 25, right: 25, bottom: 25, left: 25 }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{props.options.title}</Text>
    </View>
  )
}

const defaultScreenOptions = {
  header: (props)=> <HeaderTitle {...props} />,
  tabBarStyle: {
    height: 70,
    borderTopWidth: 0, // 去掉底部边框
    backgroundColor: '#fff',
  },
  tabBarBackground: () => {
    return (
      <FastImage style={{ position: 'absolute', left: 0, top: -20, width: '100%', height: '100%' }} resizeMode='contain' source={require('../../assets/tab/tab_banner_bg.png')} />
    );
  },
}

class HomePage extends Component {

  render() {
    return (
      <Tab.Navigator initialRouteName='World' screenOptions={defaultScreenOptions}>
        <Tab.Screen name="World" component={StoryTabPage} options={{
          tabBarLabel: "",
          title: "世界",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'世界'} />),
        }} />
        <Tab.Screen name="Explore" component={ExploreTabPage} options={{
          tabBarLabel: "",
          title: "探索",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'探索'} />),
        }} />
        <Tab.Screen name="Arena" component={ArenaTabPage} options={{
          tabBarLabel: "",
          title: "竞技",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'竞技'} />),
        }} />
        <Tab.Screen name="Compose" component={ComposeTabPage} options={{
          tabBarLabel: "",
          title: "制作",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'制作'} />),
        }} />
        <Tab.Screen name="Props" component={PropsTabPage} options={{
          tabBarLabel: "",
          title: "道具",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'道具'} />),
        }} />
        <Tab.Screen name="Lottery" component={LotteryTabPage} options={{
          tabBarLabel: "",
          title: "抽奖",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'抽奖'} />),
        }} />
        <Tab.Screen name="Profile" component={ProfileTabPage} options={{
          tabBarLabel: "",
          title: '设置',
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'设置'} />),
        }} />
      </Tab.Navigator>
    );
  }
  
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.AppModel }))(HomePage);
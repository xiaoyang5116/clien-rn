
import React from 'react';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  connect,
  Component,
  StyleSheet,
  ThemeContext,
} from "../constants";
import { Header1 } from '../constants/custom-ui';
import { ImagePanel } from '../components/panel';

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
import ExploreTabPage from './home/ExploreTabPage';
import { Platform, ImageBackground } from 'react-native';
import { px2pd } from '../constants/resolution';
import TownTabPage from './home/TownTabPage';
import { log } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const TabIcon = (props) => {

  const theme = React.useContext(ThemeContext);

  return (
    <View style={[theme.tabBottomImgStyle, { position: 'absolute', left: 5, top: -30 }]}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={theme.tabBottomImage} />
      <View style={[theme.tabBottomLabelStyle, { position: 'absolute', width: 24 }]}>
        <Text style={{ fontSize: px2pd(60), color: props.color }}>{props.title}</Text>
      </View>
    </View>

  );
}

const HeaderTitle = (props) => {
  return (
    <Header1 style={{ marginTop: 30, marginBottom: 10, }} title={props.options.title} />
  )
}

const TabBarBackground = (props) => {
  const theme = React.useContext(ThemeContext);
  return (
    <FastImage style={{ position: 'absolute', left: 0, top: -25, width: '100%', height: '100%' }} resizeMode='contain' source={theme.tabBannerBg} />
  );
}

const defaultScreenOptions = {
  header: (props) => <HeaderTitle {...props} />,
  tabBarShowLabel: false,
  tabBarStyle: {
    height: 70,
    borderTopWidth: 0, // 去掉底部边框
    backgroundColor: 'rgba(0,0,0,0)',
  },
  tabBarInactiveTintColor: '#fff',
  tabBarBackground: () => <TabBarBackground />,
}

class HomePage extends Component {

  static contextType = ThemeContext

  render() {
    return (
      <ImagePanel source={this.context.profileBg}>
        <Tab.Navigator initialRouteName='World' sceneContainerStyle={{ backgroundColor: 'none' }} screenOptions={defaultScreenOptions}>
          <Tab.Screen name="World" component={StoryTabPage} options={{
            title: "世界",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'世界'} />),
          }} />
          <Tab.Screen name="Explore" component={ExploreTabPage} options={{
            title: "探索",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'探索'} />),
          }} />
          <Tab.Screen name="Town" component={TownTabPage} options={{
            title: "城镇",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'城镇'} />),
          }} />
          <Tab.Screen name="Compose" component={ComposeTabPage} options={{
            title: "制作",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'制作'} />),
          }} />
          <Tab.Screen name="Props" component={PropsTabPage} options={{
            title: "道具",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'道具'} />),
          }} />
          <Tab.Screen name="Lottery" component={LotteryTabPage} options={{
            title: "抽奖",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'抽奖'} />),
          }} />
          <Tab.Screen name="Profile" component={ProfileTabPage} options={{
            title: "设置",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'设置'} />),
          }} />
        </Tab.Navigator>
      </ImagePanel>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(HomePage);

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
import { Platform } from 'react-native';
import { px2pd } from '../constants/resolution';
import TownTabPage from './home/TownTabPage';

const Tab = createBottomTabNavigator();

const TabIcon = (props) => {

  const theme = React.useContext(ThemeContext);

  return (
    <View style={[theme.tabBottomImgStyle, { position: 'absolute', left: 5, top: -30, }]}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={theme.tabBottomImage} />
      <View style={[theme.tabBottomLabelStyle, { position: 'absolute', width: 24 }]}>
        <Text style={{ fontSize: px2pd(60), color: props.color }}>{props.title}</Text>
      </View>
    </View>
  );
}

// const HeaderTitle = (props) => {
//   return (
//     <View style={[{ marginTop: (Platform.OS == 'android' ? 0 : 40), height: 45, width: '100%', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>
//       <ImageCapInset
//         style={{ width: '100%', height: '100%', position: 'absolute', }}
//         source={require('../../assets/tab/tab_header_bg.png')}
//         capInsets={{ top: 25, right: 25, bottom: 25, left: 25 }}
//       />
//       <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 18 }}>{props.options.title}</Text>
//     </View>
//   )
// }

const TabBarBackground = (props) => {
  const theme = React.useContext(ThemeContext);
  return (
    <View style={{ height: 70, }}>
      <FastImage style={{ position: 'absolute', left: 0, top: -20, width: '100%', height: '100%' }} resizeMode='contain' source={theme.tabBannerBg} />
    </View>

  );
}

const defaultScreenOptions = {
  // header: (props)=> <HeaderTitle {...props} />,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: px2pd(200),
    height: 0,
    borderTopWidth: 0, // 去掉底部边框
  },
  tabBarInactiveTintColor: '#fff',
  tabBarBackground: () => <TabBarBackground />,
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
        <Tab.Screen name="Town" component={TownTabPage} options={{
          tabBarLabel: "",
          title: "城镇",
          tabBarIcon: ({ color }) => (<TabIcon color={color} title={'城镇'} />),
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
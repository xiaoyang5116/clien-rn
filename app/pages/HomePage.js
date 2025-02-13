
import React from 'react';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  connect,
  Component,
  ThemeContext,
  statusBarHeight
} from "../constants";
import { Header1 } from '../constants/custom-ui';
import { ImagePanel } from '../components/panel';

import {
  View,
  Text,
} from '../constants/native-ui';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import StoryTabPage from './home/StoryTabPage';
import ProfileTabPage from './home/ProfileTabPage';
import CollectionTabPage from './home/CollectionTabPage';
import { Platform, TouchableWithoutFeedback } from 'react-native';
import { isPad, px2pd } from '../constants/resolution';
import TownTabPage from './home/TownTabPage';
import RoleTabPage from './home/RoleTabPage';
import PageUtils from '../utils/PageUtils';

const Tab = createBottomTabNavigator();

const EmptyPage = (props) => {
  return (<></>);
}

const TabIcon = (props) => {

  const theme = React.useContext(ThemeContext);

  const button = (
    <View style={[theme.tabBottomImgStyle, { position: 'absolute', top: -px2pd(40), justifyContent: 'center', alignItems: 'center', transform: [{ scale: (isPad() ? 0.8 : 1) }] }]}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={theme.tabBottomImage} />
      <View style={[{ width: px2pd(60) }]}>
        <Text style={{ fontSize: px2pd(60), color: props.color }}>{props.title}</Text>
      </View>
    </View>
  );

  if (lo.isEqual(props.title, '道具')) {
    return (
      <TouchableWithoutFeedback onPress={() => PageUtils.openPropsPage() }>
        {button}
      </TouchableWithoutFeedback>
    )
  } else if (lo.isEqual(props.title, '探索')) {
    return (
      <TouchableWithoutFeedback onPress={() => PageUtils.openExplorePage() }>
        {button}
      </TouchableWithoutFeedback>
    )
  } else {
    return (button);
  }
}

const HeaderTitle = (props) => {
  return (
    <Header1 style={{ marginTop: (Platform.OS == 'ios' ? (statusBarHeight + 10) : 15), marginBottom: 10, }} title={props.options.title} />
  )
}

const TabBarBackground = (props) => {
  const theme = React.useContext(ThemeContext);
  return (
    <View style={{ alignItems: 'center' }}>
      {/* <FastImage style={{ width: '100%', height: px2pd(135) }} resizeMode='stretch' source={theme.tabBannerBg} /> */}
    </View>
  );
}

const defaultScreenOptions = {
  header: (props) => <HeaderTitle {...props} />,
  tabBarShowLabel: false,
  tabBarStyle: {
    height: px2pd(200) + (Platform.OS == 'ios' ? 20 : 0),
    borderTopWidth: 0, // 去掉底部边框
    backgroundColor: 'rgba(0,0,0,0)',
    elevation: 0,  // 去除 android 底部多余图片
  },
  tabBarItemStyle: { // 缩小底部响应区域防止误点边缘
    marginLeft: 20,
    marginRight: 20,
  },
  tabBarInactiveTintColor: '#333',
  tabBarBackground: () => <TabBarBackground />,
}

class HomePage extends Component {

  static contextType = ThemeContext

  render() {
    return (
      <ImagePanel source={this.context.profileBg}>
        <Tab.Navigator initialRouteName='World' sceneContainerStyle={{ backgroundColor: 'none' }} screenOptions={defaultScreenOptions}>
          <Tab.Screen name="Role" component={RoleTabPage} options={{
            title: "人物",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'人物'} />),
          }} />
          <Tab.Screen name="World" component={StoryTabPage} options={{
            title: "世界",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'世界'} />),
          }} />
          <Tab.Screen name="Explore" component={EmptyPage} options={{
            title: "探索",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'探索'} />),
          }} />
          <Tab.Screen name="Town" component={TownTabPage} options={{
            title: "城镇",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'城镇'} />),
          }} />
          <Tab.Screen name="Collection" component={CollectionTabPage} options={{
            title: "灵物收藏",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'收藏'} />),
          }} />
          <Tab.Screen name="Profile" component={ProfileTabPage} options={{
            title: "设置",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'设置'} />),
          }} />
          <Tab.Screen name="Props" component={EmptyPage} options={{
            title: "道具",
            tabBarIcon: ({ focused, color }) => (<TabIcon color={focused ? color : this.context.tabBottomTextColor} title={'道具'} />),
          }} />
        </Tab.Navigator>
      </ImagePanel>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(HomePage);

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
import { px2pd } from '../constants/resolution';
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
    <View style={[theme.tabBottomImgStyle, { position: 'absolute', left: 5, top: -30 }]}>
      <FastImage style={{ position: 'absolute', width: '100%', height: '100%' }} source={theme.tabBottomImage} />
      <View style={[theme.tabBottomLabelStyle, { position: 'absolute', width: 24 }]}>
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
    <Header1 style={{ marginTop: (Platform.OS == 'ios' ? statusBarHeight + 10 : 30), marginBottom: 10, }} title={props.options.title} />
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
          <Tab.Screen name="Role" component={RoleTabPage} options={{
            title: "人物",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'人物'} />),
          }} />
          <Tab.Screen name="World" component={StoryTabPage} options={{
            title: "世界",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'世界'} />),
          }} />
          <Tab.Screen name="Explore" component={EmptyPage} options={{
            title: "探索",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'探索'} />),
          }} />
          <Tab.Screen name="Town" component={TownTabPage} options={{
            title: "城镇",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'城镇'} />),
          }} />
          <Tab.Screen name="Collection" component={CollectionTabPage} options={{
            title: "灵物收藏",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'收藏'} />),
          }} />
          <Tab.Screen name="Profile" component={ProfileTabPage} options={{
            title: "设置",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'设置'} />),
          }} />
          <Tab.Screen name="Props" component={EmptyPage} options={{
            title: "道具",
            tabBarIcon: ({ color }) => (<TabIcon color={color} title={'道具'} />),
          }} />
        </Tab.Navigator>
      </ImagePanel>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(HomePage);
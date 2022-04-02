
import React from 'react';

import { 
  Image, ImageBackground
} from 'react-native';

import {
  action,
  connect,
  Component,
} from "../constants";

import { View } from '../constants/native-ui';
import { ImageButton } from '../constants/custom-ui';
import * as RootNavigation from '../utils/RootNavigation';
import Shock from '../components/shock';
import Modal from '../components/modal'

class FirstPage extends Component {

  render() {
    return (
        <ImageBackground  style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }} source={require('../../assets/bg.jpg')}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <ImageButton height={60} source={require('../../assets/story_button.png')} selectedSource={require('../../assets/story_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Article');
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Home', { 
                screen: 'Profile',
              });
             }} />
            <ImageButton height={60} source={require('../../assets/home_button.png')} selectedSource={require('../../assets/home_button_selected.png')} onPress={() => { 
              this.props.dispatch(action('AppModel/firstStep')())
                .then(r => {
                  RootNavigation.navigate('Home');
                });
             }} />
            <ImageButton height={60} source={require('../../assets/profile_button.png')} selectedSource={require('../../assets/profile_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Home', { 
                screen: 'Profile',
              });
             }} />
            <ImageButton height={60} source={require('../../assets/test_button.png')} selectedSource={require('../../assets/test_button_selected.png')} onPress={() => { 
              // Shock.shockShow('bigShock');
              Modal.show({ 
                style: 6, title: '神秘阵盘', dialogType: 'FullScreenDialog', 
                sections: [
                  { key: 'p1', style: 2, content: ['你迅速跑过去，地面有些东西。', '走开走开，马夫大喝， 正从远处拨开人群走来。', '获得几颗石头珠子，看起来能卖不少钱。'],btn: [{title: '去拿菜刀',tokey: "p2"},{title: '去拿画轴', tokey: "p3"}]},
                  { key: 'p2', style: 2, content: ['来这里这么多天了，连个像样的防身东西都没有，你觉得菜刀出现的正是时候。','动不了','动不了','动不了'],btn: [{title: '退出',tokey: "next"}]},
                  { key: 'p3', style: 2, content: ['那是一个没有磕碰的精美画轴，你直觉的感到那些是个很值钱的东西。','动不了','动不了','动不了'], btn: [{title: '退出',tokey: "next"}]},
                ]
              })
             }} />
          </View>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
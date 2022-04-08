
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
                style: 8, title: '神秘阵盘', textAnimationType: 'TextSingle',
                sections: [
                  { 
                    key: 'p1',
                    dialog: [
                      {id: '02',content: ['这里是外来的一般商家来的市场，一般为了图个彩头，不会有多寒酸 我们就在这附近讨乞。不出这条路就行。', '讨乞后每天晚上要给帮派利钱，不然被记住会被帮派打走。', ],},
                      {id: '01',content: ['好的'],},
                    ],
                    btn:[{title: '开始乞讨',tokey: "p2"},{title: '退出',tokey: "next"}]
                  },
                  { 
                    key: 'p2',
                    dialog: [
                      {id:'02',content: ['记住不要去北街，那是富人才能去的地方，乞丐是去不了的。会被打。']}
                    ],
                    btn: [{title: '退出',tokey: "next"}]
                  },
                ]
              })
             }} />
          </View>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
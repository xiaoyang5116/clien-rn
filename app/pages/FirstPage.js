
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
import RootView from '../components/RootView';
// import MailBox from '../components/mailBox';
import ArchivePage from './ArchivePage';
import MailBoxPage from './MailBoxPage';

class FirstPage extends Component {

  render() {
    return (
        <ImageBackground  style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }} source={require('../../assets/bg/first_bg.jpg')}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <ImageButton height={60} source={require('../../assets/button/story_button.png')} selectedSource={require('../../assets/button/story_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Article');
             }} />
            <ImageButton height={60} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Article');
             }} />
            <ImageButton height={60} source={require('../../assets/button/home_button.png')} selectedSource={require('../../assets/button/home_button_selected.png')} onPress={() => { 
              this.props.dispatch(action('StoryModel/enter')({ sceneId: 'wzkj' }));
             }} />
            <ImageButton height={60} source={require('../../assets/button/continue_button.png')} selectedSource={require('../../assets/button/continue_button_selected.png')} onPress={() => { 
              this.props.dispatch(action('StoryModel/reEnter')({ }));
             }} />
            <ImageButton height={60} source={require('../../assets/button/archive_button.png')} selectedSource={require('../../assets/button/archive_button_selected.png')} onPress={() => { 
              const key = RootView.add(<ArchivePage onClose={() => {
                RootView.remove(key);
              }} />);
             }} />
            <ImageButton height={60} source={require('../../assets/button/profile_button.png')} selectedSource={require('../../assets/button/profile_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Home', { 
                screen: 'Profile',
              });
             }} />
            <ImageButton height={60} source={require('../../assets/button/test_button.png')} selectedSource={require('../../assets/button/test_button_selected.png')} onPress={() => { 
              // Shock.shockShow('bigShock');
              const key = RootView.add(<MailBoxPage onClose={() => { RootView.remove(key) }} />);
            }} />
          </View>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
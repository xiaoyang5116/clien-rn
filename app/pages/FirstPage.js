
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
import MailBox from '../components/mailBox';
import ArchivePage from './ArchivePage';

class FirstPage extends Component {

  render() {
    return (
        <ImageBackground  style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }} source={require('../../assets/bg.jpg')}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <ImageButton height={60} source={require('../../assets/story_button.png')} selectedSource={require('../../assets/story_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Article');
             }} />
            <ImageButton height={60} source={require('../../assets/continue_button.png')} selectedSource={require('../../assets/continue_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Article');
             }} />
            <ImageButton height={60} source={require('../../assets/home_button.png')} selectedSource={require('../../assets/home_button_selected.png')} onPress={() => { 
              this.props.dispatch(action('StoryModel/enter')({ sceneId: 'wzkj' }));
             }} />
            <ImageButton height={60} source={require('../../assets/continue_button.png')} selectedSource={require('../../assets/continue_button_selected.png')} onPress={() => { 
              this.props.dispatch(action('StoryModel/reEnter')({ }));
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
              const key = RootView.add(<ArchivePage onClose={() => {
                RootView.remove(key);
              }} />);
             }} />
            <ImageButton height={60} source={require('../../assets/profile_button.png')} selectedSource={require('../../assets/profile_button_selected.png')} onPress={() => { 
              RootNavigation.navigate('Home', { 
                screen: 'Profile',
              });
             }} />
            <ImageButton height={60} source={require('../../assets/test_button.png')} selectedSource={require('../../assets/test_button_selected.png')} onPress={() => { 
              // Shock.shockShow('bigShock');
              const key = RootView.add(<MailBox onClose={() => { RootView.remove(key) }} />);
            }} />
          </View>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
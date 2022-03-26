
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

class FirstPage extends Component {

  _onClick = (e) => {
    this.props.dispatch(action('AppModel/firstStep')());
  }

  render() {
    return (
        <ImageBackground  style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }} source={require('../../assets/bg.jpg')}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <ImageButton height={60} source={require('../../assets/story_button.png')} selectedSource={require('../../assets/story_button_selected.png')} onPress={() => { 
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
             }} />
            <ImageButton height={60} source={require('../../assets/archive_button.png')} selectedSource={require('../../assets/archive_button_selected.png')} onPress={() => { 
             }} />
          </View>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(FirstPage);
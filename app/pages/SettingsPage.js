
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

class SettingsPage extends Component {

  render() {
    return (
        <ImageBackground  style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }} source={require('../../assets/bg/first_bg.jpg')}>
        </ImageBackground>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(SettingsPage);
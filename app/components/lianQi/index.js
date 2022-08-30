import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';

import LianQi from './LianQi'

class LianQiPage {
  static show() {
    const key = RootView.add(
      <LianQi onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default LianQiPage

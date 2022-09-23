import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';

import LianQi from './LianQi'
import Transitions from '../transition';

class LianQiPage {
  static show() {
    const key = RootView.add(
      <Transitions id={"OPEN_LIAN_QI"}>
        <LianQi onClose={() => { RootView.remove(key); }} />
      </Transitions>
    );
  }
}

export default LianQiPage

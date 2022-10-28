import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';

import Transitions from '../transition';
import GongFaPage from './gongFaPage';

class GongFa {
  static show() {
    const key = RootView.add(
      <Transitions id={"OPEN_GONG_FA"}>
        <GongFaPage onClose={() => { RootView.remove(key); }} />
      </Transitions>
    );
  }
}

export default GongFa

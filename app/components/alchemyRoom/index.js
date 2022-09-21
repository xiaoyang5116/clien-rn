import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';
import AlchemyRoom from './AlchemyRoom';
import Transitions from '../../components/transition';

class AlchemyRoomModal {
  static show() {
    const key = RootView.add(
      <Transitions id={'OPEN_LIAN_DAN_FANG'}>
        <AlchemyRoom onClose={() => { RootView.remove(key); }} />
      </Transitions>
    );
  }
}

export default AlchemyRoomModal

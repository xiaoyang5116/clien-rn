import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';

import AlchemyRoom from './AlchemyRoom';

class AlchemyRoomModal {
  static show() {
    const key = RootView.add(
      <AlchemyRoom onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default AlchemyRoomModal

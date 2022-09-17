import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView'

import Worship from './Worship'

class WorshipModal {
  static show() {
    const key = RootView.add(
      <Worship onClose={() => {
        RootView.remove(key);
      }} />
    )
  }

}

export default WorshipModal

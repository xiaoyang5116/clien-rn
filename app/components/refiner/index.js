import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView';

import Refiner from './Refiner'

class RefinerPage {
  static show() {
    const key = RootView.add(
      <Refiner onClose={() => {
        RootView.remove(key);
      }} />
    );
  }
}

export default RefinerPage

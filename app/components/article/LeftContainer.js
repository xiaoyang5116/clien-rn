
import React from 'react';

import {
  getWindowSize,
} from "../../constants";

import {
  Animated, StyleSheet,
} from 'react-native';

import Easing from 'react-native/Libraries/Animated/Easing';
import lo from 'lodash';

const winSize = getWindowSize();

export default class LeftContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.leftPos = new Animated.Value(-winSize.width);
  }

  offsetX(x) {
    this.leftPos.setValue(-winSize.width + x);
  }

  open() {
    Animated.timing(this.leftPos, {
      toValue: lo.isNumber(this.props.openScale) ? (-winSize.width  * (1 - this.props.openScale)) : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  close() {
    Animated.timing(this.leftPos, {
      toValue: -winSize.width,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  release() {
    if (this.leftPos._value >= -winSize.width*7/10) {
      Animated.timing(this.leftPos, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(this.leftPos, {
        toValue: -winSize.width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }

  render() {
    return (
      <Animated.View style={[styles.viewContainer, { left: this.leftPos }]} onTouchStart={() => { this.close() }}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    zIndex: 100, 
    width: winSize.width, 
    backgroundColor: '#bcc3bf',
  }
});

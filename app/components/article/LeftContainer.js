
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
    this.translateX = new Animated.Value(-winSize.width);
  }

  open() {
    Animated.timing(this.translateX, {
      toValue: lo.isNumber(this.props.openScale) ? (-winSize.width  * (1 - this.props.openScale)) : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  close() {
    Animated.timing(this.translateX, {
      toValue: -winSize.width,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={[styles.viewContainer, { transform: [{ translateX: this.translateX }]}]} onTouchStart={() => { this.close() }}>
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

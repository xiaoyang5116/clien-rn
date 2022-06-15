
import React from 'react';

import {
  getWindowSize,
} from "../../constants";

import {
  Animated, StyleSheet,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';

const winSize = getWindowSize();

export default class RightContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.rightPos = new Animated.Value(-winSize.width);
  }

  offsetX(x) {
    this.rightPos.setValue(-winSize.width + x);
  }

  open() {
    Animated.timing(this.rightPos, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  close() {
    Animated.timing(this.rightPos, {
      toValue: -winSize.width,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  release() {
    if (this.rightPos._value >= -winSize.width*7/10) {
      Animated.timing(this.rightPos, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(this.rightPos, {
        toValue: -winSize.width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }

  render() {
    return (
        <Animated.View style={[styles.viewContainer, { right: this.rightPos }]} onTouchStart={() => { this.close(); }}>
          {this.props.children}
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute', 
    top: 0, 
    zIndex: 100, 
    width: winSize.width, 
    height: winSize.height, 
    backgroundColor: '#bcc3bf',
  }
});

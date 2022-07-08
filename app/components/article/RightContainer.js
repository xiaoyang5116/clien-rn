
import React from 'react';

import {
  EventKeys,
  getWindowSize,
} from "../../constants";


import {
  Animated, DeviceEventEmitter, StyleSheet,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';

const winSize = getWindowSize();

export default class RightContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.translateX = new Animated.Value(winSize.width);
    this.listeners = [];
  }

  componentDidMount() {
    this.listeners.push(DeviceEventEmitter.addListener(EventKeys.HIDE_DIRECTORY_MAP, () => this.close()));
  }

  componentWillUnmount() {
    this.listeners.forEach(e => e.remove());
    this.listeners.length = 0;
  }

  open() {
    Animated.timing(this.translateX, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  close() {
    Animated.timing(this.translateX, {
      toValue: winSize.width,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
        <Animated.View style={[styles.viewContainer, { transform: [{ translateX: this.translateX }] }]} onTouchStart={() => { this.close(); }}>
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

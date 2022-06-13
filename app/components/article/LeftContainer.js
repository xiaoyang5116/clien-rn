
import React from 'react';

import {
  getWindowSize,
} from "../../constants";

import {
  TouchableWithoutFeedback,
} from '../../constants/native-ui';

import {
  Animated,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';

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
      toValue: 0,
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
      <TouchableWithoutFeedback onPress={() => this.close()}>
        <Animated.View style={{ position: 'absolute', left: this.leftPos, top: 0, zIndex: 100, width: winSize.width, height: winSize.height, backgroundColor: '#bcc3bf' }}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

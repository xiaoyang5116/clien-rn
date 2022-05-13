
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

const winSize = getWindowSize();

export default class RightContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.rightPos = new Animated.Value(-winSize.width);
  }

  offsetX(x) {
    this.rightPos.setValue(-winSize.width + x);
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

  handlePress = (e) => {
    // 关闭界面
    Animated.timing(this.rightPos, {
      toValue: -winSize.width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  } 

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Animated.View style={{ position: 'absolute', right: this.rightPos, top: 0, zIndex: 100, width: winSize.width, height: winSize.height, backgroundColor: '#a49f99' }}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

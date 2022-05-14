
import React from 'react';

import {
  getWindowSize,
  StyleSheet,
} from "../../constants";

import {
  TouchableWithoutFeedback,
} from '../../constants/native-ui';

import {
  Animated,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';

const winSize = getWindowSize();
const VIEW_WIDTH = winSize.width - 60;
const VIEW_HEIGHT = winSize.height;

export default class PropertiesContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.rightPos = new Animated.Value(-winSize.width);
    this.expanded = false;
  }

  offsetX(x) {
    this.rightPos.setValue(-winSize.width + x);
  }

  release() {
    if (this.rightPos._value >= -winSize.width*0.98) {
      if (!this.expanded) {
        Animated.timing(this.rightPos, {
          toValue: 0,
          duration: 300,
          easing: Easing.cubic,
          useNativeDriver: false,
        }).start(() => {
          this.expanded = true;
        });
      } else {
        this.closeHandle();
      }
    }
  }

  closeHandle = () => {
    // 关闭界面
    Animated.timing(this.rightPos, {
      toValue: -winSize.width,
      duration: 300,
      easing: Easing.cubic,
      useNativeDriver: false,
    }).start(() => {
      this.expanded = false;
    });
  } 

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.closeHandle}>
        <Animated.View style={[styles.viewContainer, { right: this.rightPos }]}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute', 
    top: 0, 
    zIndex: 100, 
    width: VIEW_WIDTH, 
    height: VIEW_HEIGHT, 
    backgroundColor: '#a49f99',
    borderRadius: 10,
  }
});
import { Text, View, Animated, Easing } from 'react-native';
import React, { PureComponent } from 'react';

export default class TextAnimation extends PureComponent {
  state = {
    opacity: new Animated.Value(0),
    // opacity: new Animated.Value(0),
  };
  componentDidMount() {

    Animated.parallel([
      Animated.timing(this.state.opacity, { toValue: 1, duration: 500, useNativeDriver: false, easing: Easing.ease }),
    ]).start()
  }
  render() {
    console.log("props.children", this.props.children, this.props.children.length);

    return (
      <View>
        <Animated.Text style={{ opacity: this.state.opacity }}>{this.props.children}
        </Animated.Text>
      </View>
    )
  }
}

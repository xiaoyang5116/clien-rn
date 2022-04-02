import { Text, View, Animated, Easing } from 'react-native';
import React, { PureComponent } from 'react';

export default class TextAnimation extends PureComponent {
  state = {
    opacity: new Animated.Value(0),
  };
  componentDidMount() {

    Animated.parallel([
      Animated.timing(this.state.opacity, { toValue: 1, duration: 500, useNativeDriver: false, easing: Easing.ease }),
    ]).start()
  }
  render() {
    // console.log("props.children", this.props.children, this.props.children.length);

    return (
      <View style={{ marginTop: 12 }}>
        <Animated.Text style={{ opacity: this.state.opacity, fontSize: 20 }}>
          {this.props.children}
        </Animated.Text>
      </View>
    )
  }
}

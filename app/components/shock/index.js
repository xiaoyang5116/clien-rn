import { StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useRef, Component } from 'react'


let shockRoot = null;

export default class Shock extends Component {
  constructor(props) {
    super(props);
    shockRoot = this;
    this.state = {
      valueX: new Animated.Value(0),
      valueY: new Animated.Value(0),
      shockType: '',
      // 执行次数
      count: 0,
      delay: 0,
    }
  }

  index = 0
  timer = null

  componentDidUpdate() {
    // 判断是否有震动动画
    if (this.state.shockType !== '') {
      this.timer = setTimeout(() => {
        this.vibrationAnimation(this.state.shockType)
      }, this.state.delay);

    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  vibrationAnimation = (type) => {
    if (this.index < this.state.count) {
      if (type === 'slightShock') this.slightShock()
      if (type === 'bigShock') this.bigShock()
      this.index += 1
    }
    else {
      Animated.parallel([

        Animated.timing(this.state.valueX, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(this.state.valueY, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start()
      this.index = 0
      this.setState({ shockType: '', count: 0 })
    }
  }
  // 小幅度随机震动
  slightShock = () => {
    let X = Math.floor(Math.random() * 10 + 1);
    let Y = Math.floor(Math.random() * 10 + 1);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.valueX, { toValue: X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(this.state.valueY, { toValue: Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.valueX, { toValue: -X, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(this.state.valueY, { toValue: -Y, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(() => { this.vibrationAnimation("slightShock") })
  }

  // 大幅度随机震动
  bigShock = () => {
    let X = Math.floor(Math.random() * 10 + 10);
    let Y = Math.floor(Math.random() * 10 + 10);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.valueX, { toValue: X, duration: 100, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(this.state.valueY, { toValue: Y, duration: 100, useNativeDriver: false, easing: Easing.ease }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.valueX, { toValue: -X, duration: 100, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(this.state.valueY, { toValue: -Y, duration: 100, useNativeDriver: false, easing: Easing.ease }),
      ]),
    ]).start(() => { this.vibrationAnimation("bigShock") })
  }

  render() {
    return (
      <Animated.View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateX: this.state.valueX }, { translateY: this.state.valueY }]
      }}>
        {this.props.children}
      </Animated.View>
    )
  }

  static shockShow(type, delay = 0, count = 4) {
    shockRoot.setState({
      shockType: type,
      delay,
      count,
    })
  };
}

const styles = StyleSheet.create({})
import { Text, View, Animated, Easing } from 'react-native';
import React, { PureComponent } from 'react';

export default class TextAnimation extends PureComponent {
    state = {
        opacity: new Animated.Value(0),
    };
    componentDidMount() {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.ease,
            }),
        ]).start();
    }
    render() {
        return (
            <Animated.Text
                style={{
                    opacity: this.state.opacity,
                    fontSize: this.props.fontSize || 18,
                    ...this.props.style,
                }}>
                {this.props.children}
                {this.props.icon}
            </Animated.Text>
        );
    }
}

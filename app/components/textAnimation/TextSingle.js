import { Text, Animated } from 'react-native';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TextSingle extends PureComponent {
    state = {
        currentText: '',
        iconShow: false,
        fadeAnim: new Animated.Value(1)
    };

    timer = null;

    single = () => {
        if (this.timer === null) {
            this.timer = setTimeout(() => {
                this.timer = setInterval(() => {
                    if (this.state.currentText.length < this.props.children.length) {
                        this.setState({
                            currentText:
                                this.state.currentText +
                                this.props.children[this.state.currentText.length],
                        });
                    } else {
                        clearInterval(this.timer);
                        this.setState({
                            iconShow: true,
                        });
                    }
                }, 20);
            }, 0);
        }
    };

    fadeIn = () => {
        Animated.timing(this.state.fadeAnim, {
            toValue: this.props.opacity,
            duration: 460,
            useNativeDriver: false,
        }).start();
    };

    componentDidMount() {
        this.single();
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    componentDidUpdate() {
        if (this.props.isShowAllContent === true) {
            clearInterval(this.timer);
        }
    }

    render() {
        if (this.props.isShowAllContent) {
            if (this.props.isFadeIn) {
                this.fadeIn()
                return (
                    <Animated.Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style, opacity: this.state.fadeAnim }}>
                        {this.props.children}
                    </Animated.Text>
                )
            }
            return (
                <Animated.Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style, opacity: this.props.opacity }}>
                    {this.props.children}
                </Animated.Text>
            )

        }
        if (this.props.icon) {
            return (
                <Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style }}>
                    {this.state.currentText + (this.state.iconShow ? this.props.icon : '')}
                </Text>
            );
        }
        return (
            <Text style={{ fontSize: this.props.fontSize || 18, ...this.props.style }}>
                {this.state.currentText}
            </Text>
        );
    }
}

TextSingle.prototypes = {
    isShowAllContent: PropTypes.bool,
    fontSize: PropTypes.number,
    style: PropTypes.object,
    icon: PropTypes.string,
    opacity: PropTypes.number,
    isFadeIn: PropTypes.bool,
    children: PropTypes.node
};

TextSingle.defaultProps = {
    isShowAllContent: false,
    opacity: 1,
    isFadeIn: false
};

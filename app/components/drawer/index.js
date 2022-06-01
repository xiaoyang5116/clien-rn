
import React from 'react';
import PropTypes from 'prop-types';

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
const VIEW_WIDTH = winSize.width;
const VIEW_HEIGHT = winSize.height;

export default class Drawer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.position = new Animated.Value(-winSize.width);
        this.expanded = false;
    }

    offsetX(x) {
        this.position.setValue(-winSize.width + Math.abs(x));
    }

    release() {
        if (this.position._value >= -winSize.width * 0.98) {
            if (!this.expanded) {
                Animated.timing(this.position, {
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
        Animated.timing(this.position, {
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
                <Animated.View style={[
                    styles.viewContainer,
                    (this.props.direction == 'left') ? { left: this.position } : { right: this.position },
                    {
                        width: this.props.margin ? (VIEW_WIDTH - this.props.margin) : VIEW_WIDTH,
                        overflow:'hidden'
                    },
                    this.props.style ? this.props.style : null
                ]}>

                    {this.props.children}
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

Drawer.propTypes = {
    direction: PropTypes.string,
    margin: PropTypes.number,
};

Drawer.defaultProps = {
    direction: 'right',
};

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute',
        top: 0,
        zIndex: 100,
        height: VIEW_HEIGHT,
    }
});
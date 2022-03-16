import React, { useRef } from 'react';

import {
    delay,
    Component,
    getWindowSize,
  } from "../constants";

import PropTypes from 'prop-types';
import { View } from '../constants/native-ui';
import { Animated, Easing } from 'react-native';

async function timer(cb, dt) {
    for (;;) {
        await delay(dt);
        const result = cb();
        if (result == undefined || !result)
            break;
    }
}

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.trans = false;
        this.state = {
            refWidth: new Animated.Value(0),
            index: 0,
        };
        this.sections = [
            { x: 0,  y: 30,  color: '#ff2600' },
            { x: 30, y: 60,  color: '#ffd479' },
            { x: 60, y: 100, color: '#12b7b5' },
        ];
        // [{toValue: xxx, duration: xxx, color: xxx}...]
        this.sequeue = [];
    }

    componentDidUpdate() {
        const kv = this.sequeue[this.state.index];
        if (kv != undefined) {
            Animated.timing(this.state.refWidth, {
                toValue: kv.toValue,
                duration: kv.duration,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start((e) => {
                if ((this.state.index + 1) < this.sequeue.length) {
                    this.setState({ ...this.state, index: this.state.index + 1 })
                } else {
                    this.state.index = -1;
                    if (this.props.onCompleted != undefined) {
                        this.props.onCompleted();
                    }
                }
            });
        }
    }

    playAnimation() {
        return (this.props.percent != undefined
                && this.props.toPercent != undefined
                && this.props.percent != this.props.toPercent
                && this.props.duration != undefined
                && this.props.duration > 0);
    }

    onLayout = (e) => {
        const { width } = e.nativeEvent.layout;

        let percentage = this.props.percent;
        let value = width * percentage / 100;
        this.state.refWidth.setValue(value);

        if (this.playAnimation() && (this.props.toPercent > this.props.percent)) {
            for (let key in this.sections) {
                const section = this.sections[key];
                if (percentage >= section.x && percentage <= section.y) {
                    const diffPercent = (this.props.toPercent >= section.y) ? (section.y - percentage) : (this.props.toPercent - percentage);
                    const diffWith = width * diffPercent / 100;

                    value += diffWith;
                    percentage += diffPercent;

                    this.sequeue.push({ 
                        toValue: value, 
                        duration: (diffWith / ((this.props.toPercent - this.props.percent) / 100 * width)) * this.props.duration, 
                        color: section.color 
                    });
                }
            }
        } else if (this.playAnimation() && (this.props.toPercent < this.props.percent)) {
            for (let key in this.sections) {
                const section = this.sections[(this.sections.length - 1) - key];
                if (percentage >= section.x && percentage <= section.y) {
                    const diffPercent = (this.props.toPercent <= section.x) ? (percentage - section.x) : (percentage - this.props.toPercent);
                    const diffWith = width * diffPercent / 100;

                    value -= diffWith;
                    percentage -= diffPercent;

                    this.sequeue.push({ 
                        toValue: value, 
                        duration: (diffWith / ((this.props.percent - this.props.toPercent) / 100 * width)) * this.props.duration, 
                        color: section.color 
                    });
                }
            }
        }

        // console.debug(this.sequeue);
        this.setState({ ...this.state });
    }

    getBannerColor() {
        const kv = this.sequeue[this.state.index];
        if (kv != undefined) {
            return { backgroundColor: kv.color };
        } else if (!this.playAnimation() && this.props.percent != undefined) {
            let defaultColor = '';
            this.sections.forEach((e) => { if (this.props.percent >= e.x) defaultColor = e.color; });
            return { backgroundColor: defaultColor };
        } else {
            return {};
        }
    }

    render() {
        return (
        <View style={{ flex: 1, height: 10, justifyContent: 'flex-start', backgroundColor: '#e1e1e1' }} onLayout={this.onLayout} >
            <Animated.View style={[this.getBannerColor(), { height: '100%', width: this.state.refWidth }]}></Animated.View>
        </View>
        );
    }
}

ProgressBar.propTypes = {
    percent: PropTypes.number,
    toPercent: PropTypes.number,
    duration: PropTypes.number,
    onCompleted: PropTypes.func,
};

ProgressBar.defaultProps = {
    percent: 0,
    toPercent: 0,
    duration: 0,
    onCompleted: undefined,
};
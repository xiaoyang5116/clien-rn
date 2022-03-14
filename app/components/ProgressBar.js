import React from 'react';

import {
    delay,
    Component,
  } from "../constants";

import PropTypes from 'prop-types';
import { View, Text } from '../constants/native-ui';
import { Progress } from '../constants/antd-ui';

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
            percent: 0,
        };
    }

    _update = () => {
        let newValue = this.state.percent - 1;
        if (newValue < 0) newValue = 0;

        this.setState({
            percent: newValue,
        });

        return (newValue != 0);
    }

    getBarColor() {
        let barColor = {};
        if (this.state.percent >= 60)
            barColor = { borderColor: '#12b7b5' };
        else if (this.state.percent >= 30)
            barColor = { borderColor: '#ffd479' };
        else
            barColor = { borderColor: '#ff2600' };
        return barColor;
    }

    render() {
        if ((this.props.percent != this.state.percent) && !this.trans) {
            this.trans = true;
            this.state.percent = this.props.percent;
            timer(this._update, this.props.duration / this.props.percent).then(success => {
                this.trans = false;
                if (this.props.onCompleted != undefined) {
                    this.props.onCompleted();
                }
            });
        }

        return (
        <View style={{ flex: 1, height: 45 }}>
            <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center',  height: 42 }}><Text>{this.state.percent}%</Text></View>
            <Progress percent={this.state.percent} style={{ justifyContent: 'center', backgroundColor: '#e1e1e1' }} barStyle={[{ borderBottomWidth: 3 }, this.getBarColor()]} />
        </View>
        );
    }
}

ProgressBar.propTypes = {
    percent: PropTypes.number,
    duration: PropTypes.number,
    onCompleted: PropTypes.func,
};

ProgressBar.defaultProps = {
    percent: 0,
    duration: 0,
    onCompleted: undefined,
};
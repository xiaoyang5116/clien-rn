import React from 'react';
import PropTypes from 'prop-types';

import {
    Component,
} from "../constants";

import { Text, View, TouchableHighlight } from '../constants/native-ui';

export class CButton extends Component {
    constructor(props) {
        super(props);
    }

    _isTextStyle() {
        return (this.props.title != undefined && this.props.title.length > 0);
    }

    _isImageStyle() {
        return false;   // 预留
    }

    render() {
        const childs = [];
        const style = {};
        if (this._isTextStyle()) {
            style.backgroundColor = this.props.disabled ? '#999' : this.props.color;
            childs.push(<Text key={0} style={[{ paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, fontSize: this.props.fontSize, color: this.props.fontColor, textAlign: 'center' }]} >{this.props.title}</Text>);
        } else if (this._isImageStyle()) {
            // TODO
        }
        return (
            <TouchableHighlight underlayColor={this.props.underlayColor} activeOpacity={0.75} disabled={this.props.disabled} 
                onPress={() => {
                    if (this.props.onPress != undefined && !this.props.disabled) this.props.onPress();
                }} >
                <View style={[style, {...this.props.style}]}>
                    {childs}
                </View>
            </TouchableHighlight>
        );
    }
}

CButton.propTypes = {
    title: PropTypes.string,
    fontSize: PropTypes.number,
    fontColor: PropTypes.string,
    color: PropTypes.string,
    underlayColor: PropTypes.string,
    style: PropTypes.object,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};

CButton.defaultProps = {
    title: '',
    fontSize: 20,
    fontColor: '#0433ff',
    color: '',
    underlayColor: '#fff',
    style: {},
    onPress: null,
    disabled: false,
};

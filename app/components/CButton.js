import React from 'react';
import PropTypes from 'prop-types';

import {
    Component,
} from "../constants";

import { Text, Image, View, TouchableHighlight, TouchableOpacity } from '../constants/native-ui';

export class CButton extends Component {
    constructor(props) {
        super(props);

        // 预生成Image对象
        if (this.isImageStyle()) {
            const imgStyles = {};
            if (this.props.height != undefined) imgStyles.height = this.props.height;
            if (this.props.width != undefined) imgStyles.width = this.props.width;

            this.state = {
                normalImage: (<Image style={imgStyles} source={this.props.source} resizeMode='center' />),
                selectedImage: (<Image style={imgStyles} source={this.props.selectedSource} resizeMode='center' />),
                onPressing: false,
            }
        }
    }

    isTextStyle() {
        return (this.props.title != undefined && this.props.title.length > 0);
    }

    isImageStyle() {
        return (this.props.source != undefined && this.props.selectedSource != undefined);
    }

    onPressIn = () => {
        if (this.props.disabled)
            return;
        if (this.isImageStyle()) {
            this.setState({ onPressing: true });
        }
    }

    onPressOut = () => {
        if (this.props.disabled)
            return;
        if (this.isImageStyle()) {
            this.setState({ onPressing: false });
        }
    }

    onPress = () => {
        if (this.props.onPress != undefined && !this.props.disabled)
            this.props.onPress();
    }

    render() {
        const style = {};
        if (this.isTextStyle()) {
            style.backgroundColor = this.props.disabled ? '#999' : this.props.color;
            return (
                <TouchableHighlight underlayColor={this.props.underlayColor} activeOpacity={0.75} disabled={this.props.disabled} onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress} >
                    <View style={[style, {...this.props.style}]}>
                        <Text key={0} style={[{ paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8, fontSize: this.props.fontSize, color: this.props.fontColor, textAlign: 'center' }]} >{this.props.title}</Text>
                    </View>
                </TouchableHighlight>
            );
        } else if (this.isImageStyle()) {
            return (
                <TouchableOpacity disabled={this.props.disabled} activeOpacity={1} onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress} >
                    <View style={[style, {...this.props.style}]}>
                        {this.state.onPressing ? this.state.selectedImage : this.state.normalImage}
                    </View>
                </TouchableOpacity>
            );
        }
        return (<></>);
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

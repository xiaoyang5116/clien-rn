import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    Component,
    StyleSheet,
    ThemeContext,
} from "../constants";

import ImageCapInset from 'react-native-image-capinsets-next';
import { Text, Image, View, TouchableHighlight, TouchableOpacity } from '../constants/native-ui';
import ButtonClickEffects from './animation/buttonClickEffects';

// const TEXT_BUTTON_BG = [
//     require('../../assets/button/40dpi.png'), // 正常状态
//     require('../../assets/button/40dpi_gray.png'), // 无效状态
// ];

// 通用按钮实现
// onPress 回调函数可返回 对象指定 disabled 属性控制按钮是否禁用。
export class CButton extends Component {
    static contextType = ThemeContext

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
        this.btnAnimateRef = React.createRef()
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
        if (this.props.onPress != undefined && !this.props.disabled) {
            return this.props.onPress();
        }
        // if (this.props.onPress != undefined && !this.props.disabled && this.props.sourceType !== "reader") {
        //     return this.props.onPress();
        // }
        // if (this.props.onPress != undefined && !this.props.disabled && !this.isImageStyle() && this.props.sourceType === "reader") {
        //     return this.btnAnimateRef.current.start();
        // }
    }

    render() {
        if (this.isTextStyle()) {
            const defaultStyle = {
                backgroundColor: (this.props.disabled ? '#999' : this.props.color),
                ...styles.border,
            };
            const imgBg = this.props.disabled ? this.context.btnPattern_2_img : this.context.btnPattern_1_img;
            return (
                <TouchableHighlight underlayColor={this.props.underlayColor} activeOpacity={0.75} disabled={this.props.disabled} onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress} >
                    <View style={[defaultStyle, { ...this.props.style }]}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            source={imgBg}
                            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                        />
                        {/* <ButtonClickEffects ref={this.btnAnimateRef} onPress={this.props.onPress} btnAnimateId={this.props.btnAnimateId} /> */}
                        <Text key={0} style={[styles.text, { fontSize: this.props.fontSize, color: this.props.fontColor }]} >{this.props.title}</Text>
                    </View>
                </TouchableHighlight>
            );
        } else if (this.isImageStyle()) {
            const defaultStyle = {};
            return (
                <TouchableOpacity disabled={this.props.disabled} activeOpacity={1} onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress} >
                    <View style={[defaultStyle, { ...this.props.style }]}>
                        {this.state.onPressing ? this.state.selectedImage : this.state.normalImage}
                    </View>
                </TouchableOpacity>
            );
        }
        return (<></>);
    }
}

const styles = StyleSheet.create({
    text: {
        paddingTop: 5, paddingBottom: 5, paddingLeft: 12, paddingRight: 12,
        textAlign: 'center',
    },
    border: {
        borderColor: '#666', borderWidth: 1, borderRadius: 3,
    },
});

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

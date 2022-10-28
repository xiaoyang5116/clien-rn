import React from 'react';
import PropTypes from 'prop-types';

import {
    DataContext,
    StyleSheet,
    ThemeContext,
} from "../constants";

import ImageCapInset from 'react-native-image-capinsets-next';
import { Text, Image, View, TouchableHighlight, TouchableOpacity } from '../constants/native-ui';
import ButtonClickEffects from './animation/buttonClickEffects';

// 通用按钮实现
// onPress 回调函数可返回 对象指定 disabled 属性控制按钮是否禁用。
const CButton = (props) => {

    const isTextStyle = () => { return (props.title != undefined && props.title.length > 0); }
    const isImageStyle = () => { return (props.source != undefined && props.selectedSource != undefined); }

    const theme = React.useContext(ThemeContext);
    const dataContext = React.useContext(DataContext);
    const [images, setImages] = React.useState([]);
    const [pressing, setPressing] = React.useState(false);
    const btnAnimateRef = React.createRef();

    React.useEffect(() => {
        if (isImageStyle()) {
            const imgStyles = {};
            if (props.height != undefined) imgStyles.height = props.height;
            if (props.width != undefined) imgStyles.width = props.width;
            //
            const list = [];
            list.push(<Image style={imgStyles} source={props.source} resizeMode='center' />);
            list.push(<Image style={imgStyles} source={props.selectedSource} resizeMode='center' />);
            //
            setImages(list);
            setPressing(false);
        }
    }, []);

    const onPressIn = () => {
        if (props.disabled)
            return;

        // 更新全局状态（记录点击按下）
        dataContext.pressIn = true;

        if (isImageStyle()) {
            setPressing(true);
        }
    }

    const onPressOut = () => {
        if (props.disabled)
            return;

        // 更新全局状态（记录点击按下）
        dataContext.pressIn = false;

        if (isImageStyle()) {
            setPressing(false);
        }
    }

    const onPress = () => {
        if (props.onPress != undefined && !props.disabled && props.sourceType !== "reader") {
            return props.onPress();
        }

        if (props.onPress != undefined && !props.disabled && !isImageStyle() && props.sourceType === "reader") {
            return btnAnimateRef.current.start();
        }
    }

    if (isTextStyle()) {
        const defaultStyle = {
            backgroundColor: (props.disabled ? '#999' : props.color),
            ...styles.border,
            justifyContent:'center',
            alignItems:'center',
            overflow:"hidden"
        };
        const imgBg = props.disabled ? theme.btnPattern_2_img : theme.btnPattern_1_img;
        return (
            <TouchableHighlight underlayColor={props.underlayColor} activeOpacity={0.75} disabled={props.disabled} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={props.containerStyle}>
                <View style={[ defaultStyle, { ...props.style } ]}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        source={imgBg}
                        capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                    />
                    <ButtonClickEffects ref={btnAnimateRef} onPress={props.onPress} btnAnimateId={props.btnAnimateId} />
                    <Text key={0} style={[styles.text, { fontSize: props.fontSize, color: props.fontColor }]} >{props.title}</Text>
                </View>
            </TouchableHighlight>
        );
    } else if (isImageStyle()) {
        const defaultStyle = {};
        return (
            <TouchableOpacity disabled={props.disabled} activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} >
                <View style={[defaultStyle, { ...props.style }]}>
                    {pressing ? images[1] : images[0]}
                </View>
            </TouchableOpacity>
        );
    } else {
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
    containerStyle:PropTypes.object
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
    containerStyle: {},
};

export default CButton;
import React from 'react';
import PropTypes from 'prop-types';
import { BlurView } from "@react-native-community/blur";
import { View } from 'react-native';

// 白色磨砂效果
const LightBlurView = (props) => {
    if (props.inner) {
        return (
            <BlurView
                style = {props.style}
                blurType = "light"
                blurAmount = {props.blurAmount}
                reducedTransparencyFallbackColor="white">
                {props.children}
            </BlurView>
        );
    } else {
        return (
            <View style={props.style}>
                <BlurView
                    style = {{ position: 'absolute', width: '100%', height: '100%' }}
                    blurType = "light"
                    blurAmount = {props.blurAmount}
                    reducedTransparencyFallbackColor="white" />
                {props.children}
            </View>
        );
    }
}

export default LightBlurView;

LightBlurView.propTypes = {
    style: PropTypes.object,
    blurAmount: PropTypes.number,
    inner: PropTypes.bool, // 子节点是否嵌套在模糊层内(嵌套在内会自动裁剪子节点溢出的内容)
};

LightBlurView.defaultProps = {
    style: { flex: 1 },
    blurAmount: 10,
    inner: false,
};
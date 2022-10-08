import React from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { BlurView } from "@react-native-community/blur";

// 暗黑磨砂效果
const DarkBlurView = (props) => {
    if (props.inner) {
        return (
            <BlurView
                style = {props.style}
                blurType = "dark"
                blurAmount = {10}
                reducedTransparencyFallbackColor="white">
                {props.children}
            </BlurView>
        );
    } else {
        return (
            <View style={props.style}>
                <BlurView
                    style = {{ position: 'absolute', width: '100%', height: '100%' }}
                    blurType = "dark"
                    blurAmount = {10}
                    reducedTransparencyFallbackColor="white" />
                {props.children}
            </View>
        );
    }
}

export default DarkBlurView;

DarkBlurView.propTypes = {
    style: PropTypes.object,
    inner: PropTypes.bool, // 子节点是否嵌套在模糊层内(嵌套在内会自动裁剪子节点溢出的内容)
};

DarkBlurView.defaultProps = {
    style: { flex: 1 },
    inner: false,
};
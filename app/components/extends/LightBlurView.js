import React from 'react';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";

// 白色磨砂效果
const LightBlurView = (props) => {
    return (
        <BlurView
            style = {props.style}
            blurType = "light"
            blurAmount = {10}
            reducedTransparencyFallbackColor="white">
            {props.children}
        </BlurView>
    )
}

export default LightBlurView;

LightBlurView.propTypes = {
    style: PropTypes.object,
};

LightBlurView.defaultProps = {
    style: { flex: 1 }
};
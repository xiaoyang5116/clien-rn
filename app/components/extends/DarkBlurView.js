import React from 'react';
import PropTypes from 'prop-types';

import { BlurView } from "@react-native-community/blur";

// 暗黑磨砂效果
const DarkBlurView = (props) => {
    return (
        <BlurView
            style = {props.style}
            blurType = "dark"
            blurAmount = {10}
            reducedTransparencyFallbackColor="white">
            {props.children}
        </BlurView>
    )
}

export default DarkBlurView;

DarkBlurView.propTypes = {
    style: PropTypes.object,
};

DarkBlurView.defaultProps = {
    style: { flex: 1 }
};
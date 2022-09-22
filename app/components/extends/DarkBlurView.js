import React from 'react';

import { 
    View,
} from 'react-native';

import { BlurView } from "@react-native-community/blur";

// 暗黑磨砂效果
const DarkBlurView = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <BlurView
                style = {{ position: 'absolute', width: '100%', height: '100%' }}
                blurType = "dark"
                blurAmount = {10}
                reducedTransparencyFallbackColor="white" />
            {props.children}
        </View>
    )
}

export default DarkBlurView;
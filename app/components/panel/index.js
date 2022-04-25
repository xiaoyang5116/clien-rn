import React from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import {
    View,
} from '../../constants/native-ui';

import {
    getWindowSize,
    getPanelPatternImage,
} from '../../constants';

/** 普通面板 */
export default class Panel extends React.Component {
    render() {
        const size = getWindowSize();
        const patternImage = getPanelPatternImage(this.props.patternId);
        return (
            <View style={{ flex: 1, backgroundColor: '#fafbfa' }} >
                <FastImage style={{ position: 'absolute', left: 0, top: -100, width: size.width, height: 250, opacity: 0.1 }} resizeMode='cover' source={require('../../../assets/bg/panel_a.png')} />
                <FastImage style={{ position: 'absolute', left: size.width / 4, top: size.height / 4 - 60, width: '50%', height: '50%', opacity: 0.05 }} resizeMode='contain' source={patternImage} />
                <FastImage style={{ position: 'absolute', left: 0, bottom: -100, width: size.width, height: 250, opacity: 0.1 }} resizeMode='cover' source={require('../../../assets/bg/panel_c.png')} />
                {this.props.children}
            </View>
        );
    }
}

Panel.propTypes = {
    patternId: PropTypes.number,
};

Panel.defaultProps = {
    patternId: 1,
};
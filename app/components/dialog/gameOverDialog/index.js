import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList } from 'react-native';

import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    animationAction,
    SHCOK,
    EDGE_LIGHT
} from '../../../constants';

import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import Shock from '../../shock';
import EdgeLightModal from '../../animation/EdgeLight';

import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';

// import * as RootNavigation from '../../utils/RootNavigation';

const GameOverDialog = props => {
    const { dialogType } = props;

    if (dialogType === 'HalfScreen') {
        return (
            <HalfSingle  {...props} />
        );
    }
    if (dialogType === 'FullScreen') {
        return (
            <FullSingle {...props} />
        );
    }
    return null;
}

export default connect((state) => ({ ...state.SceneModel, ...state.ExploreModel }))(GameOverDialog);

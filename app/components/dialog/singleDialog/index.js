import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList, DeviceEventEmitter } from 'react-native';

import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    EventKeys
} from '../../../constants';

import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import Animation from '../../animation';

import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';
import OptionsPage from '../../../pages/OptionsPage';
import RootView from '../../RootView';


const SingleDialog = props => {

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
};

export default SingleDialog

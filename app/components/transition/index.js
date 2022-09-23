import React from 'react';
import PropTypes from 'prop-types';

import lo from 'lodash';
import * as trans from '../../../config/trans.json';
import { errorMessage } from '../../constants';

import ColorScreenTransition from './ColorScreenTransition';
import OpenXTransition from './OpenXTransition';
import BlackCircleTransition from './BlackCircleTransition';
import OpenYTransition from './OpenYTransition';
import BlurTransition from './BlurTransition';
import XuanWoTransition from './XuanWoTransition';
import { View } from 'react-native';

const Transitions = (props) => {

    let transitionName = props.transitionName;
    
    if (props.id != undefined) {
        const found = lo.find(trans.default, (e) => lo.isEqual(e.id, props.id));
        if (found == undefined) {
            errorMessage(`"${props.id}" 转场ID无效`);
            return <></>;
        }
        transitionName = found.name;
    }

    switch(transitionName) {
        case 'BlackScreen':
        case '黑色转场':
            return (<ColorScreenTransition config={{ duration: 300 }}>{props.children}</ColorScreenTransition>);

        case 'WhiteScreen':
        case '白色转场':
            return (<ColorScreenTransition config={{ duration: 300 }} color={'#fff'}>{props.children}</ColorScreenTransition>);
        
        case 'BlackVideoScreen':
        case '黑色视频转场':
            return (<ColorScreenTransition>{props.children}</ColorScreenTransition>);
        
        case 'WhiteVideoScreen':
        case '白色视频转场':
            return (<ColorScreenTransition color={'#fff'}>{props.children}</ColorScreenTransition>);

        case 'OpenXScreen':
        case '左右开门转场':
            return (<OpenXTransition>{props.children}</OpenXTransition>);

        case 'OpenYScreen':
        case '上下开门转场':
            return (<OpenYTransition>{props.children}</OpenYTransition>);

        case 'BlackCircleScreen':
        case '黑色圆形转场':
            return (<BlackCircleTransition>{props.children}</BlackCircleTransition>);

        case 'BlurScreen':
        case '模糊转场':
            return (<BlurTransition>{props.children}</BlurTransition>);

        case 'XuanWoScreen':
        case '时空漩涡转场':
            return (<XuanWoTransition>{props.children}</XuanWoTransition>);

        default:
            return <View style={{ flex: 1 }}>{props.children}</View>;
    }
}

export default Transitions;

Transitions.propTypes = {
    id: PropTypes.string,
    transitionName: PropTypes.string,
};

Transitions.defaultProps = {
};
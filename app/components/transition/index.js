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

const Transitions = (props) => {
    const found = lo.find(trans.default, (e) => lo.isEqual(e.id, props.id));
    if (found == undefined) {
        errorMessage(`"${props.id}" 转场ID无效`);
        return <></>;
    }

    switch(found.name) {
        case 'BlackScreen':
        case '黑色过渡':
            return (<ColorScreenTransition config={found}>{props.children}</ColorScreenTransition>);
        
        case 'WhiteScreen':
        case '白色过渡':
            return (<ColorScreenTransition config={found} color={'#fff'}>{props.children}</ColorScreenTransition>);

        case 'OpenXScreen':
        case '左右开门':
            return (<OpenXTransition config={found}>{props.children}</OpenXTransition>);

        case 'OpenYScreen':
        case '上下开门':
            return (<OpenYTransition config={found}>{props.children}</OpenYTransition>);

        case 'BlackCircleScreen':
        case '黑色圆形过渡':
            return (<BlackCircleTransition config={found}>{props.children}</BlackCircleTransition>);

        case 'BlurScreen':
        case '模糊过渡':
            return (<BlurTransition config={found}>{props.children}</BlurTransition>);

        case 'XuanWoScreen':
        case '时空漩涡':
            return (<XuanWoTransition config={found}>{props.children}</XuanWoTransition>);

        default:
            errorMessage(`"${found.name}" 转场不存在`);
            return <></>;
    }
}

export default Transitions;

Transitions.propTypes = {
    id: PropTypes.string,
};

Transitions.defaultProps = {
};
import React from 'react';
import PropTypes from 'prop-types';

import ColorScreenTransition from './ColorScreenTransition';
import OpenXTransition from './OpenXTransition';

import lo from 'lodash';
import * as trans from '../../../config/trans.json';
import { errorMessage } from '../../constants';
import BlackCircleTransition from './BlackCircleTransition';

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

        case 'BlackCircleScreen':
        case '黑色圆形过渡':
            return (<BlackCircleTransition config={found}>{props.children}</BlackCircleTransition>);

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
import React from 'react';
import PropTypes from 'prop-types';

import ColorScreenTransition from './ColorScreenTransition';
import OpenTransition from './OpenTransition';

import lo from 'lodash';
import * as trans from '../../../config/trans.json';
import { errorMessage } from '../../constants';
import CircleTransition from './CircleTransition';

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

        case 'OpenScreen':
        case '开门':
            return (<OpenTransition config={found}>{props.children}</OpenTransition>);

        case 'CircleScreen':
            case '圆形过渡':
                return (<CircleTransition config={found}>{props.children}</CircleTransition>);

        default:
            errorMessage(`"${found.name}" 转场不存在`);
            return <></>;
    }
}

export default Transitions;

OpenTransition.propTypes = {
    id: PropTypes.string,
};

OpenTransition.defaultProps = {
};
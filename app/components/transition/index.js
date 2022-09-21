import React from 'react';
import PropTypes from 'prop-types';

import ColorScreenTransition from './ColorScreenTransition';
import OpenTransition from './OpenTransition';

import lo from 'lodash';
import * as trans from '../../../config/trans.json';
import { errorMessage } from '../../constants';

const Transitions = (props) => {
    const found = lo.find(trans.default, (e) => lo.isEqual(e.id, props.id));
    if (found == undefined) {
        errorMessage(`${props.id}转场ID无效`);
        return;
    }

    switch(found.name) {
        case 'BlackScreen':
        case '黑色过渡':
            return (<ColorScreenTransition>{props.children}</ColorScreenTransition>);
        
        case 'WhiteScreen':
        case '白色过渡':
            return (<ColorScreenTransition color={'#fff'}>{props.children}</ColorScreenTransition>);

        case 'OpenScreen':
        case '开门':
            return (<OpenTransition>{props.children}</OpenTransition>);
    }
}

export default Transitions;

OpenTransition.propTypes = {
    id: PropTypes.string,
};

OpenTransition.defaultProps = {
    id: undefined,
};
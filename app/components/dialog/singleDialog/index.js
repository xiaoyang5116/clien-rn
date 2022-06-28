import React from 'react';

import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';


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

import React from 'react'

import SingleDialog from './singleDialog';
import GameOverDialog from './gameOverDialog';
import MultiplayerDialog from './MultiplayerDialog';

export function DialogTemple(props) {
    switch (props.viewData.style) {
        case 6:
            return <SingleDialog {...props} />
        case 7:
            return <GameOverDialog {...props} />
        case 8:
            return <MultiplayerDialog {...props} />
        // default:
        //     return <HalfScreenDialog {...props} />
    }
}

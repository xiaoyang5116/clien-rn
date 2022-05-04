import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import HalfScreenDialog from './HalfScreenDialog';
import FullScreenDialog from './FullScreenDialog';
import SingleDialog from './singleDialog';
import GameOverDialog from './gameOverDialog';
import MultiplayerDialog from './MultiplayerDialog';

export default function DialogTemple(props) {
    // console.log("props", props);
    switch (props.style) {
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

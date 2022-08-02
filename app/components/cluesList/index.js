import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView'
import CluesList from './CluesList';


class Clues {
    static show() {
        const key = RootView.add(
            <CluesList onClose={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default Clues

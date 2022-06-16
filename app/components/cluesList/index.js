import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import RootView from '../RootView'
import CluesList from './CluesList';
import NewCluesList from './NewCluesList';


class Clues {
    static show() {
        const key = RootView.add(
            <NewCluesList onClose={() => {
                RootView.remove(key);
            }} />
            // <CluesList onClose={() => {
            //     RootView.remove(key);
            // }} />
        );
    }
}

export default Clues

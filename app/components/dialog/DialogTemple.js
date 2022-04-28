import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import HalfScreenDialog from './HalfScreenDialog';
import FullScreenDialog from './FullScreenDialog';

export default function DialogTemple(props) {
    switch (props.type) {
        case 'HalfScreen':
            return <HalfScreenDialog textAnimationType={props.textAnimationType} currentStyles={props.currentStyles} onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
        case 'FullScreen':
            return <FullScreenDialog textAnimationType={props.textAnimationType} currentStyles={props.currentStyles} onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
        default:
            return <HalfScreenDialog textAnimationType={props.textAnimationType} currentStyles={props.currentStyles} onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
    }
}

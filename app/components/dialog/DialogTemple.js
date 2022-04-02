import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import HalfScreenDialog from './HalfScreenDialog';
import FullScreenDialog from './FullScreenDialog';

export default function DialogTemple(props) {
  switch (props.type) {
    case 'HalfScreenDialog':
      return <HalfScreenDialog  currentStyles={props.currentStyles}  onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
    case 'FullScreenDialog':
      return <FullScreenDialog  currentStyles={props.currentStyles}  onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
  }
}

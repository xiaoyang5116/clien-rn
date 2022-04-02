import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import HalfScreenDialog from './HalfScreenDialog';
import FullScreenDialog from './FullScreenDialog';

export default function DialogTemple(props) {
  console.log("props", props.type);
  switch (props.type) {
    case 'HalfScreenDialog':
      return <HalfScreenDialog isGame={true} onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
    case 'FullScreenDialog':
      return <FullScreenDialog isGame={true} onDialogCancel={props.onDialogCancel} title={props.title} popUpComplex={props.popUpComplex} />
  }
  return null

}

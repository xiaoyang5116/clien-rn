import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import LeftTopTitle_Btn from './LeftTopTitle_Btn'
import TopAndBottomTitle_Btn from './TopAndBottomTitle_Btn'
import RightBottomTitle_Btn from './RightBottomTitle_Btn'
import SingleLine from './SingleLine'
import Video_Btn from './Video_Btn'


const OptionComponents = (props) => {
  const { btnType } = props

  switch (btnType) {
    case "A0":
      return <SingleLine {...props} />
    case "A1":
      return <LeftTopTitle_Btn {...props} />
    case "A2":
      return <TopAndBottomTitle_Btn {...props} />
    case "A3":
      return <RightBottomTitle_Btn {...props} />
    case "A4":
      return <Video_Btn {...props} />
  }
}

export default OptionComponents

const styles = StyleSheet.create({})
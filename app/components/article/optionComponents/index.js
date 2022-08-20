import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BasicBtn from '../optionComponents/BasicBtn'

const OptionComponents = (props) => {
  const { type } = props

  switch (type) {
    case "basic":
      return <BasicBtn {...props} />
  }
}

export default OptionComponents

const styles = StyleSheet.create({})
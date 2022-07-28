import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import BaDaoModel from './BaDao'
import DaoGuangModel from './DaoGuang'
import JianGuangModel from './JianGuang'

const KnifeLightEffects = (props) => {
  const { type } = props
  switch (type) {
    case "拔刀":
      return BaDaoModel.show(props)
    case "飞卷刀光1":
      return BaDaoModel.show(props)
    case "飞卷刀光2":
      return DaoGuangModel.show(props)
    case "剑光1":
      return JianGuangModel.show(props)
    default:
      break;
  }
  return null
}

export default KnifeLightEffects

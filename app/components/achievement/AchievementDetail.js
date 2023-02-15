import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatDateTime } from '../../utils/DateTimeUtils'
import { TextButton } from '../../constants/custom-ui'


const Title = ({ title }) => {
  return (
    <View style={{ height: 40, width: "46%", backgroundColor: "#AEAEAE", justifyContent: "center", alignItems: 'center' }}>
      <Text style={{ fontSize: 16, color: "#000" }}>{title}</Text>
    </View>
  )
}

const AchievementDetail = (props) => {
  const { item, onClose } = props
  const { title, rarity, detail } = item

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 99 }}>
      <SafeAreaView style={{ flex: 1, }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: "#000" }}>{title}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 12, paddingRight: 12, marginTop: 30 }}>
          <Title title={title} />
          <Title title={rarity} />
        </View>
        <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 30 }}>
          <Title title={"详细描述"} />
          <View style={{ borderWidth: 1, borderColor: "#ccc", height: 120, marginTop: 12, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
            <Text>{detail}</Text>
          </View>
        </View>
        <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 30 }}>
          <View style={{ height: 40, backgroundColor: "#AEAEAE", justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: "#000" }}>获得时间：{formatDateTime(item.unlockTime)}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <TextButton title={"退出"} onPress={onClose} />
        </View>


      </SafeAreaView>
    </View >
  )
}

export default AchievementDetail

const styles = StyleSheet.create({})
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { formatDateTime } from '../../utils/DateTimeUtils'
import { TextButton } from '../../constants/custom-ui'
import { px2pd } from '../../constants/resolution'
import FastImage from 'react-native-fast-image'


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
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 99, justifyContent: "center", alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 0, }}>
        </View>
      </TouchableWithoutFeedback>
      <ImageBackground style={{ width: px2pd(988), height: px2pd(1469), alignItems: 'center' }}
        source={require('../../../assets/achievement/detail/bg.png')}
      >
        <ImageBackground style={{ width: px2pd(770), height: px2pd(126), marginTop: 35, alignItems: 'center', justifyContent: 'center' }}
          source={require('../../../assets/achievement/detail/title_bg.png')}
        >
          <Text style={{ fontSize: 20, color: "#1d0d06" }}>{title}</Text>
        </ImageBackground>
        <View style={{ width: px2pd(339), height: px2pd(59), marginTop: 20, justifyContent: 'center' }}>
          <FastImage
            style={{ width: px2pd(339), height: px2pd(59) }}
            source={require('../../../assets/achievement/detail/xiyoudu.png')} />
          <View style={{ position: 'absolute', right: 0 }}>
            <Text style={{ fontSize: 13, color: "#e7decb" }}>{rarity}</Text>
          </View>
        </View>
        <ImageBackground
          style={{ width: px2pd(826), height: px2pd(428), marginTop: 20, padding: 12, }}
          source={require('../../../assets/achievement/detail/content_border.png')}
        >
          <Text style={{ fontSize: 16, color: "#e7decb", }}>{detail}</Text>
        </ImageBackground>
        <View style={{ marginTop: 80, flexDirection: 'row', width: px2pd(826), justifyContent: 'space-between', alignItems: "center" }}>
          <ImageBackground
            style={{ width: px2pd(339), height: px2pd(107), justifyContent: "flex-end", alignItems: "center" }}
            source={require('../../../assets/achievement/detail/huode_time.png')}>
            <Text style={{ fontSize: 16, color: "#d4c6a2", }}>{formatDateTime(item.unlockTime)}</Text>
          </ImageBackground>
          <ImageBackground
            style={{ width: px2pd(339), height: px2pd(107), justifyContent: "flex-end", alignItems: "center" }}
            source={require('../../../assets/achievement/detail/huode_renshu.png')}>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View >
  )
}

export default AchievementDetail

const styles = StyleSheet.create({})
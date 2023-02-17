import { SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'

import { connect, action } from '../../constants'
import { ImageBtn, ReturnButton, TextButton } from '../../constants/custom-ui'
import GongFaLevel from './gongFaLevel'
import SkillPage from './skillPage'
import FastImage from 'react-native-fast-image'
import { px2pd } from '../../constants/resolution'


const GongFaPage = (props) => {
  const { onClose } = props
  const [tab, setTab] = useState("gongFa")

  return (
    <View style={styles.viewContainer}>
      <FastImage style={{ position: 'absolute', width: '100%', height: "100%" }} source={require('../../../assets/gongFa/bg.png')} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {tab === "gongFa" ? <GongFaLevel /> : <SkillPage />}
        </View>
        <View style={styles.footerContainer}>
          <View style={{ marginLeft: 12 }}>
            <ReturnButton onPress={onClose} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginRight: 20 }}>
            <View style={{ marginRight: 20 }}>
              <ImageBtn
                imgStyle={{ width: px2pd(159), height: px2pd(172) }}
                source={require('../../../assets/gongFa/gongfa_btn_1.png')}
                selectedSource={require('../../../assets/gongFa/gongfa_btn_2.png')}
                onPress={() => { setTab("gongFa") }}
              />
            </View>

            <ImageBtn
              imgStyle={{ width: px2pd(159), height: px2pd(172) }}
              source={require('../../../assets/gongFa/zhuangbei_btn_1.png')}
              selectedSource={require('../../../assets/gongFa/zhuangbei_btn_2.png')}
              onPress={() => { setTab("skill") }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default GongFaPage

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    zIndex: 99,
    backgroundColor: "#fff"
  },
  footerContainer: {
    marginBottom: Platform.OS == 'android' ? 12 : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  }
})



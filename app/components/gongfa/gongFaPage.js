import { SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'

import { connect, action } from '../../constants'
import { TextButton } from '../../constants/custom-ui'
import GongFaLevel from './gongFaLevel'
import SkillPage from './skillPage'


const GongFaPage = (props) => {
  const { onClose } = props
  const [tab, setTab] = useState("gongFa")

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {tab === "gongFa" ? <GongFaLevel /> : <SkillPage />}
        </View>
        <View style={styles.footerContainer}>
          <TextButton title={"返回"} onPress={onClose} />
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
  }
})



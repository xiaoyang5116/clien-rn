import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { px2pd } from '../../../constants/resolution'
import { ImageButton } from '../../../constants/custom-ui'


const BTN_STYLE = {
  width: px2pd(969),
  height: px2pd(118),
}

const GorgeousTemplate = (props) => {
  const { viewData, onDialogCancel, actionMethod } = props
  const { sections, title } = viewData

  const _renderItem = ({ item }) => {
    return (
      <View style={{
        width: "100%",
        justifyContent: "center",
        alignItems: 'center',
      }}>
        <ImageButton
          width={px2pd(969)}
          height={px2pd(118)}
          source={require('../../../../assets/button/gorgeous_1.png')}
          selectedSource={require('../../../../assets/button/gorgeous_2.png')}
          onPress={() => {
            actionMethod(item)
            onDialogCancel()
          }}
        />
        <View pointerEvents={'none'} style={{ position: 'absolute' }}>
          <Text style={{ fontSize: 16, color: "#000", }}>{item.title}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <ImageBackground
        source={require('../../../../assets/bg/gorgeous_bg.png')}
        style={{ width: px2pd(1060), height: px2pd(1420), }}
      >
        <View style={{ marginTop: 35, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: "#ECDADE" }}>{title}</Text>
        </View>
        <View style={{ marginTop: 18, width: '100%', paddingLeft: 24, paddingRight: 24 }}>
          <Text style={{ fontSize: 18, color: "#DEC262" }}>{sections.content}</Text>
        </View>
        <View style={{ position: "absolute", left: 0, bottom: 80, width: '100%', }}>
          <FlatList
            data={sections.btn}
            renderItem={_renderItem}
          />
        </View>
      </ImageBackground>
    </View>
  )
}

export default GorgeousTemplate

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: 'center'
  }
})
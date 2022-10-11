import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { px2pd } from '../../../constants/resolution'
import { ImageButton } from '../../../constants/custom-ui'
import { getSceneTopBackgroundImage } from '../../../constants'


const Template_2 = (props) => {
  const { viewData, onDialogCancel, actionMethod } = props
  const { sections, title, imgName } = viewData

  // console.log("viewData", viewData) 

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

  // getSceneTopBackgroundImage(imgName)
  const img = getSceneTopBackgroundImage(imgName);
  return (
    <View style={styles.viewContainer}>
      <ImageBackground
        source={require('../../../../assets/bg/gorgeous_bg.png')}
        style={{ width: px2pd(1060), height: px2pd(1420), }}
      >
        <View style={{ marginTop: 35, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: "#ECDADE" }}>{title}</Text>
        </View>

        <View style={{ alignSelf: 'stretch', height: 100, marginTop: 18, }}>
          <View style={{ flex: 1, marginLeft: 24, marginRight: 24, borderColor: '#999', borderWidth: 2 }}>
            <FastImage style={{ width: '100%', height: '100%' }} source={img.img} resizeMode='cover' />
          </View>
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

export default Template_2

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: 'center'
  }
})
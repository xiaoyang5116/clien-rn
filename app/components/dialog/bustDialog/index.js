import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'

import {
  action,
  connect,
  getBustImg,
  ThemeData
} from '../../../constants'


const BustDialog = (props) => {
  const {
    viewData,
    onDialogCancel,
    actionMethod,
    specialEffects,
    figureList
  } = props

  // {"confirm": false, "hidden": false, "primaryType": 2, "sectionId": 0, 
  // "sections": [
  //   {"Location": "left", "content": [Array], "figureId": 1},
  //   {"Location": "left", "content": [Array], "figureId": 1},
  //   {"Location": "left", "content": [Array], "figureId": 1}
  // ],
  // "style": 10, "textAnimationType": "TextSingle",}

  const { sections, textAnimationType } = viewData

  const [sectionsIndex, setSectionsIndex] = useState(0)

  useEffect(() => {
    if (figureList.length === 0) {
      props.dispatch(action('FigureModel/getFigureList')());
    }
  }, [])

  const nextDialog = () => {
    if (sectionsIndex >= sections.length - 1) return onDialogCancel()
    setSectionsIndex((sectionsIndex) => sectionsIndex + 1)
  }

  const renderItem = sections.map((item, index) => {
    if (index <= sectionsIndex && figureList.length > 0) {
      const currentFigureData = figureList.find(i => i.id === item.figureId)
      return (
        <View key={index} style={{ width: "95%", height: 400, position: "absolute" }}>
          <View style={{ height: 300, width: "100%", }}>

          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.content}>
              {item.content[0]}
            </Text>
          </View>
        </View>
      )
    }
  })

  return (
    <View style={styles.viewContainer}>
      <TouchableWithoutFeedback onPress={nextDialog}>
        <View style={styles.container}>
          {renderItem}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default connect((state) => ({ ...state.FigureModel }))(BustDialog)

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    height: 150,
    width: "100%",
    backgroundColor: "#666",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 18,
    paddingRight: 18
  },
  content: {
    fontSize: 18,
    color: "#000"
  }
})
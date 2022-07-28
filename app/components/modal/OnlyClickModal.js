import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { connect, action } from './../../constants'

import ImageCapInset from 'react-native-image-capinsets-next';


const OnlyClickModal = (props) => {
  const { title, content, style } = props.viewData
  const { readerStyle } = props

  const Title = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }

  const Button = () => {
    return (
      <TouchableOpacity onPress={props.onDialogConfirm}>
        <View style={styles.btnContainer}>
          <Text style={styles.btn}>确认</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const Frame = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%", position: "absolute", zIndex: 2, padding: 4, }}>
        <ImageCapInset
          source={require("../../../assets/button/40dpi_gray.png")}
          style={{ width: "100%", height: "100%" }}
          capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
        />
      </View>
    )
  }

  const HyalineLayer = () => {
    return (
      <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 1, backgroundColor: "#fff", opacity: 0.65 }} />
    )
  }

  if (style === "1A") {
    return (
      <View style={styles.viewContainer}>
        <View style={[styles.box_1A, { backgroundColor: readerStyle.bgColor }]}>
          <Frame />
          <HyalineLayer />
          <View style={{ paddingLeft: 12, paddingRight: 12, zIndex: 3 }}>
            <Title />
            <View style={styles.contentContainer_1A}>
              <Text style={styles.content}>{content}</Text>
            </View>
            <Button />
          </View>
        </View>
      </View>
    )
  } else if (style === "1B") {
    return (
      <View style={styles.viewContainer}>
        <View style={[styles.box_1B, { backgroundColor: readerStyle.bgColor }]}>
          <Frame />
          <HyalineLayer />
          <View style={{ flex: 1, justifyContent: "space-between", paddingLeft: 12, paddingRight: 12, zIndex: 3 }}>
            <Title />
            <View style={styles.contentContainer_1B}>
              <Text style={styles.content}>{content}</Text>
            </View>
            <Button />
          </View>
        </View>
      </View>
    )
  }

  return null
}

export default connect((state) => ({ ...state.ArticleModel }))(OnlyClickModal)

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
  },
  box_1A: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    overflow: "hidden",
  },
  box_1B: {
    width: "94%",
    height: "70%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    overflow: "hidden",
  },
  titleContainer: {
    height: 60,
    width: "100%",
    marginTop: 4,
    marginBottom: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#B5B5B5",
  },
  title: {
    fontSize: 25,
    color: '#000',
    textAlign: 'center',
  },
  contentContainer_1A: {
    minHeight: 200,
  },
  contentContainer_1B: {
    flex: 1,
  },
  content: {
    fontSize: 20,
    color: "#000",
  },
  btnContainer: {
    marginTop: 12,
    marginBottom: 21,
    width: "100%",
    height: 40,
    backgroundColor: "#bbb",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9C9C9C",
    opacity: 0.6,
    justifyContent: 'center'
  },
  btn: {
    textAlign: 'center',
    fontSize: 20,
    color: "#000",
  },
})
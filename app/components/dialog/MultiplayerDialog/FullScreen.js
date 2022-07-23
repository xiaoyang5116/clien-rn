import React, { useState, useEffect, useRef, createRef } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  SafeAreaView,
  Dimensions
} from 'react-native'

import {
  ThemeContext,
} from "../../../constants";


const windowHeight = Dimensions.get('window').height;

const FullScreen = (props) => {

  const theme = React.useContext(ThemeContext);

  const {
    onDialogCancel,
    viewData,
    nextParagraph,
    refFlatList,
    historyDialogData,
    renderDialog,
    currentDialogData,
    renderBtn,
  } = props


  return (
    <View style={[styles.fullscreenContainer, theme.blockBgColor2]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullContainer}>
          <View style={styles.dialogHeader}>
            <Text onPress={onDialogCancel} style={[styles.titleFontSize, styles.back]}>返回</Text>
            <Text style={[styles.titleFontSize, styles.title]}>{viewData.title}</Text>
            <Text style={[styles.titleFontSize, styles.multifunction]}></Text>
          </View>
          <TouchableWithoutFeedback onPress={nextParagraph}>
            <View style={{
              flex: 1,
              paddingLeft: 12,
              paddingRight: 12,
            }}>
              {/* content */}
              <View style={{ width: "100%", height: '70%' }} >
                <FlatList
                  ref={refFlatList}
                  data={historyDialogData}
                  renderItem={renderDialog}
                  keyExtractor={(item, index) => item + index}
                  onContentSizeChange={() => {
                    if (historyDialogData.length > 0) {
                      refFlatList.current.scrollToEnd({ animated: true })
                    }
                  }}
                />
              </View>

              {/* 按钮区域 */}
              <View style={{ marginTop: 12 }}>
                <FlatList
                  data={currentDialogData.btn}
                  renderItem={renderBtn}
                  keyExtractor={(item, index) => item + index}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default FullScreen

const styles = StyleSheet.create({
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    right: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  fullContainer: {
    flex: 1,
    height: windowHeight,
    width: '100%',
  },
  dialogHeader: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#6a655e',
    borderBottomWidth: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  back: {
    textAlign: 'left',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    flex: 2,
  },
  multifunction: {
    textAlign: 'right',
    flex: 1,
  },
  paddingLeft: {
    paddingLeft: 12,
  },
  paddingRight: {
    paddingRight: 12,
  },
  tipLeftTriangle: {
    position: "absolute",
    left: -7,
    top: 8,
    height: 0,
    width: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 8,
    borderBottomColor: 'transparent',
    borderBottomWidth: 8,
    borderRightColor: '#fff',
    borderRightWidth: 8,
  },
  tipRightTriangle: {
    position: "absolute",
    right: -7,
    top: 8,
    height: 0,
    width: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 8,
    borderBottomColor: 'transparent',
    borderBottomWidth: 8,
    borderLeftColor: '#fff',
    borderLeftWidth: 8,
  },
  titleFontSize: {
    fontSize: 20,
  }
})
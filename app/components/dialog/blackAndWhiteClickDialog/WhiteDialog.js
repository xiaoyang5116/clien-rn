import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions,
  SafeAreaView
} from 'react-native';
import React, { useState } from 'react';

import TextAnimation from '../../textAnimation';


const WhiteDialog = (props) => {
  const {
    textAnimationType,
    nextParagraph,
    currentTextList,
    currentIndex,
    currentDialogueLength,
  } = props;

  const refFlatList = React.createRef();

  const renderText = ({ item, index }) => {
    if (index <= currentIndex) {
      // 如果 item 是数组则是特效
      if (Array.isArray(item)) {
        return null;
      }
      return (
        <TouchableWithoutFeedback onPress={nextParagraph}>
          <View style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
            {/* 隐藏内容,用于占位子 */}
            {/* <Text style={{ fontSize: 24, opacity: 0 }}> {item}</Text> */}
            <TextAnimation
              icon={
                currentIndex === index && currentIndex < currentDialogueLength
                  ? '▼'
                  : ''
              }
              fontSize={24}
              type={textAnimationType}
              style={{ color: "#000" }}>
              {item}
            </TextAnimation>
            {/* <View style={{ position: 'absolute' }}>

            </View> */}
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  };

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
          <TouchableWithoutFeedback onPress={nextParagraph}>
            <View style={{ flex: 1 }}>
              {/* 内容显示区域 */}
              <View style={{ marginTop: "25%", height: "80%" }}>
                <FlatList
                  ref={refFlatList}
                  data={currentTextList}
                  renderItem={renderText}
                  keyExtractor={(item, index) => item + index}
                  // ListFooterComponent={() => <View style={{ height: 12 }} />}
                  onContentSizeChange={() => {
                    if (currentTextList.length > 0) {
                      refFlatList.current.scrollToEnd({ animated: true });
                    }
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default WhiteDialog

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
})
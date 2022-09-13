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

import { LongTextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';


const BlackDialog = (props) => {
  const {
    textAnimationType,
    nextParagraph,
    currentTextList,
    showBtnList,
    currentIndex,
    currentDialogueLength,
    nextDialogue
  } = props;

  const btnListLength = showBtnList ? showBtnList.length : 0

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
            <TextAnimation
              icon={
                currentIndex === index && currentIndex < currentDialogueLength
                  ? '▼'
                  : ''
              }
              fontSize={24}
              type={textAnimationType}
              style={{ color: "#fff", }}>
              {item}
            </TextAnimation>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  };

  const renderBtn = ({ item }) => {
    if (currentIndex >= currentDialogueLength) {
      return (
        <View style={{ marginTop: 8, justifyContent: 'center' }}>
          <LongTextButton
            title={item.title}
            onPress={() => {
              nextDialogue(item);
            }}
          />
        </View>
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
              <View
                style={{
                  marginTop: currentIndex >= currentDialogueLength ? 0 : "25%",
                  height:
                    currentIndex >= currentDialogueLength
                      ? showBtnList
                        ? (btnListLength > 4) ? '50%' : '60%'
                        : "100%"
                      : '100%',
                }}
              >
                <FlatList
                  ref={refFlatList}
                  data={currentTextList}
                  renderItem={renderText}
                  keyExtractor={(item, index) => item + index}
                  ListFooterComponent={() => <View style={{ height: 12 }} />}
                  onContentSizeChange={() => {
                    if (currentTextList.length > 0) {
                      refFlatList.current.scrollToEnd({ animated: true });
                    }
                  }}
                />
              </View>

              {/* 按钮区域 */}
              {
                showBtnList
                  ? (
                    <View style={{ marginTop: 12, }}>
                      <FlatList
                        data={showBtnList}
                        renderItem={renderBtn}
                        keyExtractor={(item, index) => item.title + index}
                        ListFooterComponent={() => <View style={{ height: 24 }} />}
                        getItemLayout={(data, index) => ({
                          length: 48,
                          offset: 48 * index,
                          index,
                        })}
                      />
                    </View>
                  )
                  : <></>
              }
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default BlackDialog

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
})
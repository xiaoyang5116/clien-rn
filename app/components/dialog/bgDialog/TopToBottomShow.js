import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import React, { useRef, useState } from 'react';

import FastImage from 'react-native-fast-image';
import { getBgDialog_bgImage, getVideo } from '../../../constants';

import TextAnimation from '../../textAnimation';
import Video from 'react-native-video';

const TopToBottomShow = props => {
  const {
    viewData,
    handlerClick,
    currentBgImage,
    currentVideo,
    refFlatList,
    currentContent,
    dialogIndex,
    bgColor,
    _scrollToEnd,
    loop
  } = props;

  const refVideo = React.createRef()

  React.useEffect(() => {
    if (refVideo.current != null) {
      refVideo.current.seek(0);
    }

  }, []);

  const end = () => { };

  const _renderItem = ({ item, index }) => {
    if (index <= dialogIndex)
      return (
        <TouchableWithoutFeedback onPress={handlerClick}>
          <View style={{ marginTop: 12 }} onLayout={_scrollToEnd}>
            <TextAnimation
              icon={
                dialogIndex === index && dialogIndex < currentContent.length - 1
                  ? '▼'
                  : ''
              }
              fontSize={20}
              type={viewData.textAnimationType}
              style={{
                position: "absolute",
                zIndex: 2,
                ...styles.text
              }}
              opacity={dialogIndex === index ? 1 : 0.5}
              isFadeIn={true}
              isShowAllContent={dialogIndex === index ? false : true}
            >
              {item}
            </TextAnimation>
            <Text style={{ fontSize: 20, opacity: 0, }}>
              {item}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
  };

  return (
    <View style={{ flex: 1 }}>
      {currentBgImage && (
        <FastImage
          source={currentBgImage}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      )}
      {currentVideo && (
        <Video
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          ref={refVideo}
          source={currentVideo}
          fullscreen={false}
          resizeMode={'stretch'}
          repeat={loop}
          onEnd={end}
        />
      )}
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          // backgroundColor: bgColor.current,
        }}
      />
      {bgColor.current != null && <FastImage
        style={{ width: "100%", height: "100%", position: "absolute", opacity: 0.2, }}
        source={require('../../../../assets/bg/dialog_bg.png')} />}
      <TouchableWithoutFeedback onPress={handlerClick}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{ flex: 1, paddingLeft: 12, paddingRight: 12, marginTop: 24 }}>
            <FlatList
              ref={refFlatList}
              data={currentContent}
              renderItem={_renderItem}
              extraData={dialogIndex}
              onContentSizeChange={_scrollToEnd}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TopToBottomShow;

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textShadowColor: '#000',
    textShadowRadius: 3,
    shadowOpacity: 0,
  }
});

import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';

import FastImage from 'react-native-fast-image';
import RootView from "../../RootView";

import Video from 'react-native-video';
import BarrageAnimation from '../../effects/BarrageAnimation';

const BarrageShow = (props) => {
  const {
    viewData,
    handlerBarrageClick,
    section,
    currentBgImage,
    currentVideo,
    bgColor,
    loop
  } = props;

  const refVideo = React.createRef()
  React.useEffect(() => {
    if (refVideo.current != null) {
      refVideo.current.seek(0);
      const key = RootView.add(<BarrageAnimation data={section.data} onClose={() => {
        handlerBarrageClick()
        RootView.remove(key);
      }} />);
    }

    if (currentBgImage != undefined || currentVideo != undefined) {
      const key = RootView.add(<BarrageAnimation data={section.data} onClose={() => {
        handlerBarrageClick()
        RootView.remove(key);
      }} />);
    }
  }, []);

  const end = () => { };

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
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      </SafeAreaView>
    </View>
  )
}

export default BarrageShow

const styles = StyleSheet.create({})
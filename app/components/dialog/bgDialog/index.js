import {
  StyleSheet,
  Animated
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { getBgDialog_bgImage, getVideo } from '../../../constants';

import TopToBottomShow from './TopToBottomShow';
import BottomShow from './BottomShow';
import BarrageShow from './BarrageShow';

const BgDialog = props => {
  const { viewData, onDialogCancel, actionMethod } = props;

  // 对话内容索引
  const [dialogIndex, setDialogIndex] = useState(-1);
  // 对话索引
  const [sectionIndex, setSectionIndex] = useState(0);
  // 覆盖颜色
  const bgColor = useRef(null);
  const _color = 'rgba(0,0,0,0.3)';
  // flatList ref
  const refFlatList = React.createRef();
  // 当前对话
  const section = viewData.sections[sectionIndex];
  // 当前对话内容
  const currentContent = section.content;
  // 当前背景图
  const currentBgImage = section.bgImageId
    ? getBgDialog_bgImage(section.bgImageId)
    : undefined;
  // 当前背景视屏
  const currentVideo = section.videoId ? getVideo(section.videoId) : undefined;
  // 是否循环播放视屏
  const loop = section.loop ? section.loop : false;
  // 是否自动播放文字
  const play = section.play ? section.play : false;

  useEffect(() => {
    let timer = null;
    if (play && section.type != "Barrage") {
      timer = setTimeout(() => {
        if (dialogIndex === -1) {
          bgColor.current = _color;
          setDialogIndex(0);
        }
      }, 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dialogIndex]);

  // 点击事件
  const handlerClick = () => {
    if (
      dialogIndex < currentContent.length - 1 &&
      sectionIndex <= viewData.sections.length - 1
    ) {
      if (dialogIndex === -1) bgColor.current = _color;
      setDialogIndex(dialogIndex => dialogIndex + 1);
    }

    if (
      dialogIndex === currentContent.length - 1 &&
      sectionIndex < viewData.sections.length - 1
    ) {
      bgColor.current = null;
      setDialogIndex(-1);
      setSectionIndex(sectionIndex => sectionIndex + 1);
    }

    if (
      dialogIndex === currentContent.length - 1 &&
      sectionIndex === viewData.sections.length - 1
    ) {
      onDialogCancel();
      actionMethod(viewData)
    }
    _scrollToEnd();
  };

  // 弹幕点击事件
  const handlerBarrageClick = () => {
    if (sectionIndex < viewData.sections.length - 1) {
      bgColor.current = null;
      setDialogIndex(-1);
      setSectionIndex(sectionIndex => sectionIndex + 1);
    }
    if (sectionIndex === viewData.sections.length - 1) {
      onDialogCancel();
      actionMethod(viewData)
    }
  }

  // 滚动到最下面
  const _scrollToEnd = () => {
    refFlatList.current.scrollToEnd({ animated: true });
  };

  let children = <></>
  if (section.type === "TopToBottom") {
    children = (
      <TopToBottomShow
        {...props}
        handlerClick={handlerClick}
        currentBgImage={currentBgImage}
        currentVideo={currentVideo}
        refFlatList={refFlatList}
        currentContent={currentContent}
        dialogIndex={dialogIndex}
        bgColor={bgColor}
        _scrollToEnd={_scrollToEnd}
        loop={loop}
      />
    );
  } else if (section.type === "Bottom") {
    children = (
      <BottomShow
        {...props}
        handlerClick={handlerClick}
        currentBgImage={currentBgImage}
        currentVideo={currentVideo}
        refFlatList={refFlatList}
        currentContent={currentContent}
        dialogIndex={dialogIndex}
        bgColor={bgColor}
        _scrollToEnd={_scrollToEnd}
        loop={loop}
      />
    );
  } else if (section.type === "Barrage") {
    children = (
      <BarrageShow
        {...props}
        handlerBarrageClick={handlerBarrageClick}
        section={section}
        currentBgImage={currentBgImage}
        currentVideo={currentVideo}
        bgColor={bgColor}
      />
    );
  }

  return (
    <Animated.View style={{ flex: 1, }}>
      {children}
    </Animated.View>
  )
};

export default BgDialog;

const styles = StyleSheet.create({});

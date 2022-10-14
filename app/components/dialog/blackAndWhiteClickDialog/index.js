import React, { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { EventKeys } from '../../../constants';

import WhiteDialog from './WhiteDialog'
import BlackDialog from './BlackDialog'


const BlackAndWhiteClickDialog = (props) => {
  // props 传入
  const { sections, style } = props.viewData;
  const { actionMethod, specialEffects } = props

  // 定义变量
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextList, setCurrentTextList] = useState(sections[0].content);
  const [showBtnList, setShowBtnList] = useState(sections[0].btn);
  const animationEndListener = useRef(null)
  let currentDialogueLength = currentTextList.length - 1;

  // 关闭页面时移除动画监听
  useEffect(() => {
    return () => {
      if (animationEndListener.current !== null) {
        animationEndListener.current.remove();
      }
    }
  }, [])

  // 下一段话
  const nextParagraph = () => {
    if (currentIndex < currentDialogueLength) {
      // 判断下一句话是否是数组,是就代表是特效,否就下一句话
      if (Array.isArray(currentTextList[currentIndex + 1])) {
        specialEffects(currentTextList[currentIndex + 1])
        setCurrentIndex(currentIndex + 2);
        if (currentIndex + 1 === currentDialogueLength) {
          props.onDialogCancel();
        }
      }
      else {
        setCurrentIndex(currentIndex + 1);
      }

    } else {
      if (showBtnList === undefined) {
        props.onDialogCancel();
      }
    }
  };



  if (style === 9 || style === "9A") {
    return (
      <WhiteDialog
        nextParagraph={nextParagraph}
        currentTextList={currentTextList}
        currentIndex={currentIndex}
        currentDialogueLength={currentDialogueLength}
        {...props.viewData}
      />
    )
  } else if (style === "9B") {
    return (
      <BlackDialog
        nextParagraph={nextParagraph}
        currentTextList={currentTextList}
        currentIndex={currentIndex}
        currentDialogueLength={currentDialogueLength}
        {...props.viewData}
      />
    )
  }

  return null
}

export default BlackAndWhiteClickDialog
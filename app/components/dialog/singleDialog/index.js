import React, { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { EventKeys, connect, action } from '../../../constants';

import FullSingle from './FullSingle'
import HalfSingle from './HalfSingle'
import GameOverDialog from '../gameOverDialog';

const SingleDialog = (props) => {
    // props 传入
    const { sections, style, dialogType, __sceneId } = props.viewData;
    const { actionMethod, specialEffects } = props

    // 定义变量
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextList, setCurrentTextList] = useState(sections[0].content);
    const [showBtnList, setShowBtnList] = useState(sections[0].btn);
    const animationEndListener = useRef(null)
    let currentDialogueLength = currentTextList.length - 1;


    useEffect(() => {
        // 初始化 按钮状态
        props.dispatch(action('MaskModel/getOptionBtnStatus')({ optionBtnArr: showBtnList, __sceneId })).then((result) => {
            if (Array.isArray(result)) {
                setShowBtnList(result)
            }
        })

        // 关闭页面时移除动画监听
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
            }
            else {
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    // 显示下一个对话
    const nextDialogue = item => {
        const newDialogue = sections.filter(i => i.key === item.tokey);

        if (newDialogue.length > 0) {
            setCurrentTextList(newDialogue[0].content);
            // 初始化 按钮状态
            props.dispatch(action('MaskModel/getOptionBtnStatus')({ optionBtnArr: newDialogue[0].btn, __sceneId })).then((result) => {
                if (Array.isArray(result)) {
                    setShowBtnList(result)
                }
            })
            setCurrentIndex(0);
        } else {
            if (item.animation !== undefined) {
                animationEndListener.current = DeviceEventEmitter.addListener(EventKeys.ANIMATION_END, props.onDialogCancel);
            }
            else {
                props.onDialogCancel();
            }
        }

        actionMethod(item)
    };

    switch (style) {
        case 6:
            if (dialogType === "HalfScreen") {
                return (
                    <HalfSingle
                        nextParagraph={nextParagraph}
                        nextDialogue={nextDialogue}
                        currentTextList={currentTextList}
                        showBtnList={showBtnList}
                        currentIndex={currentIndex}
                        currentDialogueLength={currentDialogueLength}
                        {...props.viewData}
                    />
                )
            } else if (dialogType === "FullScreen") {
                return (
                    <FullSingle
                        nextParagraph={nextParagraph}
                        nextDialogue={nextDialogue}
                        currentTextList={currentTextList}
                        showBtnList={showBtnList}
                        currentIndex={currentIndex}
                        currentDialogueLength={currentDialogueLength}
                        {...props.viewData}
                    />
                )
            }
        case 7:
            return (
                <GameOverDialog
                    nextParagraph={nextParagraph}
                    nextDialogue={nextDialogue}
                    currentTextList={currentTextList}
                    showBtnList={showBtnList}
                    currentIndex={currentIndex}
                    currentDialogueLength={currentDialogueLength}
                    {...props.viewData}
                />
            )
    }

    return null
}

export default connect((state) => ({ ...state.MaskModel }))(SingleDialog)

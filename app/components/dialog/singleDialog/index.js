import React, { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { EventKeys, connect, action } from '../../../constants';

import lo from 'lodash';
import FullSingle from './FullSingle'
import HalfSingle from './HalfSingle'
import GameOverDialog from '../gameOverDialog';

const SingleDialog = (props) => {

    // props 传入
    const { sections, style, dialogType, __sceneId, __tokey } = props.viewData;
    const { actionMethod, specialEffects } = props

    let defaultSection = sections[0];
    if (__tokey != undefined) {
       const found = sections.find(e => lo.isEqual(e.key, __tokey));
       if (found != undefined) defaultSection = found;
    }

    // 定义变量
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextList, setCurrentTextList] = useState(defaultSection.content);
    const [showBtnList, setShowBtnList] = useState(defaultSection.btn);
    const animationEndListener = useRef(null)
    let currentDialogueLength = currentTextList.length - 1;

    // FlatList
    const refFlatList = React.createRef();


    useEffect(() => {
        // 检查 按钮状态
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
    }, [currentTextList])

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
        refFlatList.current.scrollToEnd({ animated: true });
    };

    // 显示下一个对话
    const nextDialogue = item => {
        // 执行动作
        actionMethod(item)

        const newDialogue = sections.filter(i => i.key === item.tokey);
        if (newDialogue.length > 0) {
            setCurrentTextList(newDialogue[0].content);
            setShowBtnList(newDialogue[0].btn)
            setCurrentIndex(0);
        } else {
            if (item.animation !== undefined) {
                animationEndListener.current = DeviceEventEmitter.addListener(EventKeys.ANIMATION_END, props.onDialogCancel);
            }
            else {
                props.onDialogCancel();
            }
        }
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
                        refFlatList={refFlatList}
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
                        refFlatList={refFlatList}
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
                    refFlatList={refFlatList}
                    {...props.viewData}
                />
            )
    }

    return null
}

// export default connect((state) => ({ ...state.MaskModel }))(SingleDialog)
export default SingleDialog;

import React, { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';

import {
    AppDispath,
    action,
    connect,
    EventKeys
} from '../../constants';
import Animation from '../animation';

import SingleDialog from './singleDialog';
import GameOverDialog from './gameOverDialog';
import MultiplayerDialog from './MultiplayerDialog';


const DialogTemple = (props) => {
    const { sections } = props.viewData;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextList, setCurrentTextList] = useState(sections[0].content);
    const [showBtnList, setShowBtnList] = useState(sections[0].btn);
    const animationEndListener = useRef(null)

    let currentDialogueLength = currentTextList.length - 1;

    // 场景id
    const __sceneId = props.viewData.__sceneId

    useEffect(() => {
        // 关闭页面时移除动画监听
        return () => {
            if (animationEndListener.current !== null) {
                animationEndListener.current.remove();
            }
        }
    }, [])

    // 特效方法
    const specialEffects = (arr) => {
        arr.forEach(item => {
            if (typeof item === 'string') {
                Animation(item)
            }
            else {
                props.dispatch(action('SceneModel/processActions')({ __sceneId, ...item }));
            }
        });
    }

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
            setShowBtnList(newDialogue[0].btn);
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

    // 动作方法
    const actionMethod = (item) => {
        // 特效
        if (item.animation !== undefined) {
            specialEffects(item.animation)
        }

        // 场景里的动作
        props.dispatch(action('SceneModel/processActions')({ __sceneId, ...item }));

        // 发送道具
        if (item.props !== undefined) {
            AppDispath({
                type: 'PropsModel/sendPropsBatch',
                payload: { props: item.props },
            });
        }
        // 探索事件是否完成
        if (item.isFinish !== undefined) {
            props.dispatch(action('ExploreModel/changeExploreStatus')({ id: item.isFinish.id, type: item.isFinish.type }));
        }

        // 添加 线索
        if (item.addClues !== undefined) {
            props.dispatch(action('CluesModel/addClues')(item.addClues));
        }
    }

    switch (props.viewData.style) {
        case 6:
            return (
                <SingleDialog
                    nextParagraph={nextParagraph}
                    nextDialogue={nextDialogue}
                    currentTextList={currentTextList}
                    showBtnList={showBtnList}
                    currentIndex={currentIndex}
                    currentDialogueLength={currentDialogueLength}
                    {...props.viewData}
                />
            )
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
        case 8:
            return <MultiplayerDialog {...props} />
        // default:
        //     return <HalfScreenDialog {...props} />
    }
}

export default connect((state) => ({ ...state.SceneModel, ...state.ExploreModel, ...state.CluesModel }))(DialogTemple);

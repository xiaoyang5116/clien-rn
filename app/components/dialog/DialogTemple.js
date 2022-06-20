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

    useEffect(() => {
        return () => {
            if (animationEndListener.current !== null) {
                animationEndListener.current.remove();
            }
        }
    }, [])

    const nextParagraph = () => {
        if (currentIndex < currentDialogueLength) {
            if (Array.isArray(currentTextList[currentIndex + 1])) {
                const animationList = currentTextList[currentIndex + 1]
                Animation(animationList)
                setCurrentIndex(currentIndex + 2);
            }
            else {
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    const nextDialogue = item => {
        // 显示下一个对话
        const newDialogue = sections.filter(i => i.key === item.tokey);

        if (item.animation !== undefined) {
            Animation(item.animation)
        }

        if (newDialogue.length > 0) {
            setCurrentTextList(newDialogue[0].content);
            setShowBtnList(newDialogue[0].btn);
            setCurrentIndex(0);
        } else {
            if (item.animation !== undefined) {
                animationEndListener.current = DeviceEventEmitter.addListener(EventKeys.ANIMATION_END, props.onDialogCancel);
                props.dispatch(action('SceneModel/processActions')({ __sceneId: props.viewData.__sceneId, ...item }));
            }
            else {
                props.onDialogCancel();
                props.dispatch(action('SceneModel/processActions')({ __sceneId: props.viewData.__sceneId, ...item }));
            }
        }

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

        // // 跳转到其他对话
        // if (item.dialogs !== undefined) {
        //     props.dispatch(action('SceneModel/__onDialogCommand')({ __sceneId: props.viewData.__sceneId, params: item.dialogs }))
        // }
        // 跳转到新的章节
        // if (item.toChapter !== undefined) {
        //     AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: item.toChapter, __sceneId: props.viewData.__sceneId } });
        // }
        // // 跳转到场景
        // if (item.toScene !== undefined) {
        //     props.dispatch(action('SceneModel/processActions')(item))
        //         .then(e => {
        //             // 如果是切换场景，显示选项页面
        //             if (item.toScene != undefined) {
        //                 const key = RootView.add(<OptionsPage onClose={() => {
        //                     RootView.remove(key);
        //                 }} />);
        //             }
        //         });
        // }
    };

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

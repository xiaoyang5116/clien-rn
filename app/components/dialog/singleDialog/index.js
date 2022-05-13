import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList, DeviceEventEmitter } from 'react-native';

import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    EventKeys
} from '../../../constants';

import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import Animation from '../../animation';

import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';
import OptionsPage from '../../../pages/OptionsPage';
import RootView from '../../RootView';


const SingleDialog = props => {
    /**
     * dialogType: 对话框屏幕类型
     * textAnimationType: 文字显示类型
     * title: 标题
     * sections: 对话内容
     */
    const { dialogType, textAnimationType, title, sections } = props.viewData;

    const theme = React.useContext(ThemeContext);
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
            }
            else {
                props.onDialogCancel();
            }
        }

        // 发送道具
        if (item.props !== undefined) {
            AppDispath({
                type: 'PropsModel/sendPropsBatch',
                payload: { props: item.props },
            });
        }

        // 跳转到其他对话
        if (item.dialogs !== undefined) {
            props.dispatch(action('SceneModel/__onDialogCommand')({ __sceneId: props.viewData.__sceneId, params: item.dialogs }))
        }

        // 跳转到新的章节
        if (item.toChapter !== undefined) {
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: item.toChapter, __sceneId: props.viewData.__sceneId } });
        }

        // 跳转到场景
        if (item.toScene !== undefined) {
            console.debug(item)
            props.dispatch(action('SceneModel/processActions')(item))
                .then(e => {
                    // 如果是切换场景，显示选项页面
                    if (item.toScene != undefined) {
                        const key = RootView.add(<OptionsPage onClose={() => {
                            RootView.remove(key);
                        }} />);
                    }
                });
        }

        // 探索事件是否完成
        if (item.isFinish !== undefined) {
            props.dispatch(action('ExploreModel/changeExploreStatus')({ id: item.isFinish.id, type: item.isFinish.type }));
        }
    };

    if (dialogType === 'HalfScreen') {
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
        );
    }
    if (dialogType === 'FullScreen') {
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
        );
    }
    return null;
};

export default connect((state) => ({ ...state.SceneModel, ...state.ExploreModel }))(SingleDialog);

import React, { useState } from 'react';

import { View, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    animationAction,
    SHCOK,
    EDGE_LIGHT
} from '../../../constants';

import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import Shock from '../../shock';
import EdgeLightModal from '../../animation/EdgeLight';


import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';

const SingleDialog = props => {
    const theme = React.useContext(ThemeContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextList, setCurrentTextList] = useState(props.popUpComplex[0].content);
    const [showBtnList, setShowBtnList] = useState(props.popUpComplex[0].btn);

    let currentDialogueLength = currentTextList.length - 1;

    const nextParagraph = () => {
        if (currentIndex < currentDialogueLength) {
            if (Array.isArray(currentTextList[currentIndex + 1])) {
                const animationList = currentTextList[currentIndex + 1]
                animationList.forEach(item => {
                    const acitonObj = animationAction(item)
                    switch (acitonObj.type) {
                        case SHCOK:
                            return Shock.shockShow(acitonObj.action)
                        case EDGE_LIGHT:
                            return EdgeLightModal.show(acitonObj.action)
                    }
                });
                setCurrentIndex(currentIndex + 2);
            }
            else {
                setCurrentIndex(currentIndex + 1);
            }

        }
    };

    const nextDialogue = item => {
        // 显示下一个对话
        const newDialogue = props.popUpComplex.filter(i => i.key === item.tokey);
        if (newDialogue.length > 0) {
            setCurrentTextList(newDialogue[0].content);
            setShowBtnList(newDialogue[0].btn);
            setCurrentIndex(0);
        } else {
            props.onDialogCancel();
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
            console.log("props.viewData.__sceneId", props.viewData.__sceneId);
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: item.toChapter, __sceneId: props.viewData.__sceneId } });
        }
    };

    const renderText = ({ item, index }) => {
        if (index <= currentIndex) {
            // 如果 item 是数组则是特效
            if (Array.isArray(item)) {
                return null
            }
            return (
                <View style={{ marginTop: 12 }}>
                    <TextAnimation
                        icon={
                            currentIndex === index && currentIndex < currentDialogueLength
                                ? '▼'
                                : ''
                        }
                        fontSize={20}
                        type={props.textAnimationType}
                        style={theme.contentColor3}
                    >
                        {item}
                    </TextAnimation>
                </View>
            );
        }
        return null;
    };
    const renderBtn = ({ item }) => {
        if (currentIndex === currentDialogueLength) {
            return (
                <View style={{ marginTop: 8 }}>
                    <TextButton
                        currentStyles={props.currentStyles}
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

    if (props.type === 'HalfScreen') {
        return (
            <HalfSingle
                title={props.title}
                nextParagraph={nextParagraph}
                currentTextList={currentTextList}
                renderText={renderText}
                showBtnList={showBtnList}
                renderBtn={renderBtn}
            />
        );
    }
    if (props.type === 'FullScreen') {
        return (
            <FullSingle
                title={props.title}
                nextParagraph={nextParagraph}
                currentTextList={currentTextList}
                renderText={renderText}
                showBtnList={showBtnList}
                renderBtn={renderBtn}
            />
        );
    }
    return null;
};

export default connect((state) => ({ ...state.SceneModel }))(SingleDialog);

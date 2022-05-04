import React, { useState } from 'react';

import { View, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import {
    AppDispath,
    ThemeContext,
    action,
    connect,
} from '../../../constants';

import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';

import FullSingle from './FullSingle';
import HalfSingle from './HalfSingle';

const SingleDialog = props => {
    const theme = React.useContext(ThemeContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextList, setShowList] = useState(
        props.popUpComplex[0].content,
    );
    const [showBtnList, setShowBtnList] = useState(props.popUpComplex[0].btn);

    let currentDialogueLength = currentTextList.length - 1;

    const nextParagraph = () => {
        if (currentIndex < currentDialogueLength) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    const nextDialogue = item => {
        const newDialogue = props.popUpComplex.filter(i => i.key === item.tokey);
        if (item.props !== undefined) {
            AppDispath({
                type: 'PropsModel/sendPropsBatch',
                payload: { props: item.props },
            });
        }
        if (newDialogue.length > 0) {
            setShowList(newDialogue[0].content);
            setShowBtnList(newDialogue[0].btn);
            setCurrentIndex(0);
        } else {
            props.onDialogCancel();
        }

        if (item.dialogs !== undefined) {
            props.dispatch(action('SceneModel/__onDialogCommand')({ __sceneId: props.viewData.__sceneId, params: item.dialogs }))
        }

        if (item.toChapter !== undefined) {
            console.log("props.viewData.__sceneId", props.viewData.__sceneId);
            AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: item.toChapter, __sceneId: props.viewData.__sceneId } });
        }

    };

    const renderText = ({ item, index }) => {
        if (index <= currentIndex) {
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
                        style={theme.contentColor3}>
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

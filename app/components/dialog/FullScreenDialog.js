import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import TextAnimation from '../textAnimation';



const FullScreenDialog = props => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentTextList, setShowList] = useState(props.popUpComplex[0].content)
    const [showBtnList, setShowBtnList] = useState(props.popUpComplex[0].btn)

    let currentDialogueLength = currentTextList.length - 1

    const nextParagraph = () => {
        if (currentIndex < currentDialogueLength) {
            setCurrentIndex(currentIndex + 1)
        }
    }
    const nextDialogue = (item) => {
        const newDialogue = props.popUpComplex.filter(i => i.key === item.tokey)
        if (item.props !== undefined) {
            AppDispath({ type: 'PropsModel/sendPropsBatch', payload: { props: item.props } });
        }
        if (newDialogue.length > 0) {
            setShowList(newDialogue[0].content)
            setShowBtnList(newDialogue[0].btn)
            setCurrentIndex(0)
        }
        else {
            props.onDialogCancel()
        }

    }

    const renderText = ({ item, index }) => {
        if (index <= currentIndex) {
            return (
                <View style={{ marginTop: 12 }}>
                    <TextAnimation
                        icon={(currentIndex === index) && (currentIndex < currentDialogueLength) ? "▼" : ''}
                        fontSize={20}
                        type={props.textAnimationType}
                    >
                        {item}
                    </TextAnimation>
                </View>

            )
        }
        return null
    }
    const renderBtn = ({ item }) => {
        if (currentIndex === currentDialogueLength) {
            return (
                <View style={{ marginTop: 12 }}>
                    <TextButton currentStyles={props.currentStyles} title={item.title} onPress={() => { nextDialogue(item) }} />
                </View>
            )
        }
        return null
    }

    return (
        <View style={{ backgroundColor: '#eee7dd', flex: 1, opacity: 1, paddingTop: 10 }}>
            {/* 标题 */}
            <View style={{ height: 40, backgroundColor: '#e3d8c8', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderBottomColor: '#6d6a65', borderBottomWidth: 1, borderTopColor: '#6d6a65', borderTopWidth: 1, }}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>
                    {props.title}
                </Text>
            </View>
            {/* 显示区域 */}
            <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
                <TouchableWithoutFeedback onPress={nextParagraph} >
                    <View style={{ flex: 1 }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: 350 }}>
                            <FlatList
                                data={currentTextList}
                                renderItem={renderText}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View style={{ marginTop: 20 }}>
                            <FlatList
                                data={showBtnList}
                                renderItem={renderBtn}
                                keyExtractor={(item, index) => item.title + index}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

export default FullScreenDialog;

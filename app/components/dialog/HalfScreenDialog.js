import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList,
    Button,
} from 'react-native';
import { getWindowSize } from '../../constants';
import TextAnimation from '../textAnimation';

const size = getWindowSize();

const HalfScreenDialog = props => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentTextList, setShowList] = useState(props.popUpComplex[0].content)
    const [showBtnList, setShowBtnList] = useState(props.popUpComplex[0].btn)

    let currentDialogueLength = currentTextList.length - 1

    const nextParagraph = () => {
        if (currentIndex < currentDialogueLength) {
            setCurrentIndex(currentIndex + 1)
        }
    }
    const nextDialogue = (tokey) => {
        const newDialogue = props.popUpComplex.filter(item => item.key === tokey)
        if (newDialogue.length > 0) {
            setShowList(newDialogue[0].content)
            setShowBtnList(newDialogue[0].btn)
            setCurrentIndex(0)
        }
        else {
            props.isGame ? props.onDialogCancel() : props.onHide()
        }

    }

    const renderText = ({ item, index }) => {
        if (index <= currentIndex) {
            return (
                <TextAnimation>{item}</TextAnimation>
            )
        }
        return null
    }
    const renderBtn = ({ item }) => {
        if (currentIndex === currentDialogueLength) {
            return (
                <Button title={item.title} onPress={() => { nextDialogue(item.tokey) }} />
            )
        }
    }

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
            <View style={{ width: 380, height: 600, backgroundColor: '#fff', }}>
                {/* head */}
                <View style={{ position: 'relative', overflow: 'hidden', paddingLeft: 12, paddingRight: 12, backgroundColor: '#5f7157', height: 50, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', }}>
                    {/* 标题 */}
                    <View style={{ borderRadius: 5, backgroundColor: '#e5d8ab', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: 150, }}>
                        <Text style={{ fontSize: 24, color: '#6b4e28', }}>
                            {props.title}
                        </Text>
                    </View>
                    {/* 关闭按钮 */}
                    <TouchableOpacity
                        onPress={() => { props.isGame ? props.onDialogCancel() : props.onHide() }}
                        style={{ position: 'absolute', right: 12, top: -18, overflow: 'hidden', }}
                    >
                        <View>
                            <Text style={{ fontSize: 60, }}>
                                ×
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 显示区域 */}

                <TouchableWithoutFeedback
                    onPress={nextParagraph}>
                    <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, backgroundColor: '#ede0b6', }}>
                        <View style={{ height: 350, marginTop: 12, backgroundColor: '#ddd1ab', }}>
                            <FlatList
                                data={currentTextList}
                                renderItem={renderText}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View style={{ marginTop: 20, }}>
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

export default HalfScreenDialog;

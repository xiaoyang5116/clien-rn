import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
    Button,
} from 'react-native';
import {
    getWindowSize,
    AppDispath
} from '../../constants';
import TextAnimation from '../textAnimation';
import { TextButton } from '../../constants/custom-ui';

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
    const nextDialogue = (item) => {
        const newDialogue = props.popUpComplex.filter(i => i.key === item.tokey)

        if (item.props!==undefined) {
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
                        fontSize={20}
                        icon={(currentIndex === index) && (currentIndex < currentDialogueLength) ? "▼" : ''}
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
    }

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 360, height: 600, }}>
                {/* head */}
                <View style={{ paddingLeft: 12, paddingRight: 12, backgroundColor: '#e3d5c1', height: 50, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                    {/* 标题 */}
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, color: '#696451', }}>
                            {props.title}
                        </Text>
                    </View>
                    {/* 关闭按钮 */}
                    {/* <TouchableOpacity
                        onPress={props.onDialogCancel}
                        style={{ position: 'absolute', right: 12, top: -18, overflow: 'hidden', }}
                    >
                        <View>
                            <Text style={{ fontSize: 60, }}>
                                ×
                            </Text>
                        </View>
                    </TouchableOpacity> */}
                </View>

                {/* 显示区域 */}
                <TouchableWithoutFeedback
                    onPress={nextParagraph}>
                    <View style={{ flex: 1, paddingLeft: 2, paddingRight: 2, paddingTop: 2, backgroundColor: '#eee7dd', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: 350, paddingLeft: 12, paddingRight: 12, backgroundColor: '#e8ddcc', }}>
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

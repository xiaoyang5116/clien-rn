import { View, Text, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import React, { useState } from 'react';

import { ThemeContext } from '../../../constants';
import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';


const FullSingle = props => {
    const theme = React.useContext(ThemeContext);

    const {
        title,
        textAnimationType,
        nextParagraph,
        currentTextList,
        showBtnList,
        currentIndex,
        currentDialogueLength,
        nextDialogue
    } = props;

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
                        type={textAnimationType}
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
                        // currentStyles={props.currentStyles}
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
    return (
        <View style={[{ backgroundColor: '#fff', flex: 1, opacity: 1, paddingTop: 10 }]}>
            <Image
                style={{ width: '100%', height: '100%', position: "absolute", top: 0, left: 0, zIndex: 0, opacity: 0.2 }}
                source={require('../../../../assets/bg/gameOver.png')}
            />
            {/* 标题 */}
            <View
                style={[
                    theme.rowCenter,
                    // theme.blockBgColor1,
                    {
                        backgroundColor: '#fff',
                        height: 40,
                        borderBottomColor: '#9e9a92',
                        borderBottomWidth: 1,
                        borderTopColor: '#9e9a92',
                        borderTopWidth: 1,
                    },
                ]}>
                <Text style={[{ fontSize: 20, textAlign: 'center', backgroundColor: '#fff' }]}>
                    {title}
                </Text>
            </View>
            {/* 显示区域 */}
            <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{ flex: 1 }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: '50%' }}>
                            <FlatList
                                data={currentTextList}
                                renderItem={renderText}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View
                            style={{ marginTop: 12, height: '50%', justifyContent: 'center' }}>
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

export default FullSingle;

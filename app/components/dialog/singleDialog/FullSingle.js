import { View, Text, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { ThemeContext } from '../../../constants';
import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';


const FullSingle = props => {
    const windowHeight = Dimensions.get('window').height;

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

    // FlatList
    const refFlatList = React.createRef();

    const renderText = ({ item, index }) => {
        if (index <= currentIndex) {
            // 如果 item 是数组则是特效
            if (Array.isArray(item)) {
                return null;
            }
            return (
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
                        <TextAnimation
                            icon={
                                currentIndex === index && currentIndex < currentDialogueLength
                                    ? '▼'
                                    : ''
                            }
                            fontSize={20}
                            type={textAnimationType}
                            style={theme.contentColor3}>
                            {item}
                        </TextAnimation>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return null;
    };

    const renderBtn = ({ item }) => {
        if (currentIndex >= currentDialogueLength) {
            return (
                <View
                    style={{ marginTop: 8, height: 40, justifyContent: 'center' }}
                >
                    <TextButton
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
        <View style={[theme.blockBgColor3, { flex: 1, opacity: 1, paddingTop: 10 }]}>
            {/* 标题 */}
            <View
                style={[
                    theme.rowCenter,
                    theme.blockBgColor1,
                    {
                        height: 40,
                        borderBottomColor: '#6d6a65',
                        borderBottomWidth: 1,
                        borderTopColor: '#6d6a65',
                        borderTopWidth: 1,
                    },
                ]}>
                <Text style={[theme.titleColor1, { fontSize: 20, textAlign: 'center' }]}>
                    {title}
                </Text>
            </View>
            {/* 显示区域 */}
            <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{ flex: 1 }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: "50%" }}>
                            <FlatList
                                ref={refFlatList}
                                data={currentTextList}
                                renderItem={renderText}
                                keyExtractor={(item, index) => item + index}
                                ListFooterComponent={() => <View style={{ height: 12 }} />}
                                onContentSizeChange={() => {
                                    if (currentTextList.length > 0) {
                                        refFlatList.current.scrollToEnd({ animated: true });
                                    }
                                }}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View
                            style={{ marginTop: 12, height: "50%", justifyContent: 'center' }}>
                            <FlatList
                                data={showBtnList}
                                renderItem={renderBtn}
                                keyExtractor={(item, index) => item.title + index}
                                ListFooterComponent={() => <View style={{ height: 24 }} />}
                                getItemLayout={(data, index) => (
                                    { length: 48, offset: 48 * index, index }
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

export default FullSingle;

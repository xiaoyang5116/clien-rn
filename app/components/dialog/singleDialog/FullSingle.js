import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
    Dimensions,
    SafeAreaView
} from 'react-native';
import React, { useState } from 'react';

import { ThemeContext } from '../../../constants';

import { TextButton, LongTextButton, Header1, BtnIcon } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import FastImage from 'react-native-fast-image';


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
        nextDialogue,
        refFlatList
    } = props;



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

    const HaveBtnIcon = ({ item }) => {
        const { title, icon } = item
        return (
            <>
                <LongTextButton
                    title={title}
                    // disabled={icon.show}
                    onPress={() => {
                        nextDialogue(item);
                    }}
                />
                {icon.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
            </>
        )
    }

    const renderBtn = ({ item }) => {
        if (currentIndex >= currentDialogueLength) {
            return (
                <View style={{ marginTop: 8, height: 40, justifyContent: 'center', }}>
                    {
                        item.icon
                            ? (<HaveBtnIcon item={item} />)
                            : (
                                <LongTextButton
                                    title={item.title}
                                    onPress={() => {
                                        nextDialogue(item);
                                    }}
                                />
                            )
                    }
                </View>
            );
        }
        return null;
    };

    return (
        <FastImage style={{ flex: 1 }}
            source={theme.dialogBg_2_img}
        >
            <View style={[{ flex: 1, opacity: 1 }]}>
                {/* 标题 */}
                <Header1 style={{ marginBottom: 10 }} title={title} />
                {/* 显示区域 */}
                <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
                    <TouchableWithoutFeedback onPress={nextParagraph}>
                        <View style={{ flex: 1 }}>
                            {/* 内容显示区域 */}
                            <View
                                style={{
                                    height:
                                        currentIndex >= currentDialogueLength
                                            ? showBtnList.length > 4
                                                ? '50%'
                                                : '60%'
                                            : '100%',
                                }}
                                onLayout={()=>{
                                    refFlatList.current.scrollToEnd({ animated: true });
                                }}
                            >
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
                            <View style={{ marginTop: 12, }}>
                                <FlatList
                                    data={showBtnList}
                                    renderItem={renderBtn}
                                    keyExtractor={(item, index) => item.title + index}
                                    ListFooterComponent={() => <View style={{ height: 24 }} />}
                                    getItemLayout={(data, index) => ({
                                        length: 48,
                                        offset: 48 * index,
                                        index,
                                    })}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </FastImage>
    );
};

export default FullSingle;

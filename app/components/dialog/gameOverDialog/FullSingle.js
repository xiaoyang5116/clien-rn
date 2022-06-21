import { View, Text, TouchableWithoutFeedback, FlatList, Image, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';

import { ThemeContext } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
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
        nextDialogue,
        artId,
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
                    {/* <TextButton
                        title={item.title}
                        onPress={() => {
                            nextDialogue(item);
                        }}
                    /> */}
                    <View style={{ justifyContent: "center", alignItems: 'center', overflow: 'hidden', }}>
                        <TouchableHighlight
                            underlayColor={'#fff'}
                            activeOpacity={0.5}
                            onPress={() => { nextDialogue(item) }}
                        >
                            <View style={{ width: px2pd(1016), height: px2pd(102), borderWidth: px2pd(3), borderRadius: 3, borderColor: "#a3a3a3", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                                <Image
                                    style={{ width: px2pd(1010), height: px2pd(96) }}
                                    source={require("../../../../assets/button/gameOver_btn.png")}
                                />
                            </View>
                        </TouchableHighlight>
                        <View pointerEvents="none" style={{ position: 'absolute' }}>
                            <Text style={{ fontSize: 18, color: "#6a655e", }}>{item.title}</Text>
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={[{ backgroundColor: '#fff', flex: 1, opacity: 1, paddingTop: 10 }]}>
            <Image
                style={{ width: '100%', height: '100%', position: "absolute", top: 0, left: 0, zIndex: 0, opacity: 0.2 }}
                // source={require('../../../../assets/bg/gameOver.png')}
                source={artId ? theme.artTab[artId] : theme.artTab[1]}
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
            <View style={{ flex: 1, paddingLeft: 8, paddingRight: 8, alignItems: "center" }}>
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{ flex: 1 }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: '60%' }}>
                            <FlatList
                                data={currentTextList}
                                renderItem={renderText}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View
                            style={{ marginTop: 12, height: '20%', justifyContent: 'center' }}>
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

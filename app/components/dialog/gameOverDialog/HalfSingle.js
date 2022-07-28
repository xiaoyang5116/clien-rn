import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import React from 'react';

import { ThemeContext } from '../../../constants';
import { HalfPanel } from '../../panel';
import { TextButton, BtnIcon } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';

const HalfSingle = (props) => {
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

    const HaveBtnIcon = ({ item }) => {
        const { title, icon } = item
        return (
            <>
                <TextButton
                    title={item.title}
                    onPress={() => {
                        nextDialogue(item);
                    }}
                />
                {icon.show ? <BtnIcon id={icon.id} style={{ height: "100%", justifyContent: "center" }} /> : null}
            </>
        )
    }

    const renderBtn = ({ item }) => {
        if (currentIndex === currentDialogueLength) {
            return (
                <View style={{ marginTop: 8 }}>
                    {
                        item.icon
                            ? (<HaveBtnIcon item={item} />)
                            : (
                                <TextButton
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
        <HalfPanel>
            {/* head */}
            <View style={[theme.rowCenter, { paddingLeft: 12, paddingRight: 12, height: 50, backgroundColor: '#fff' }]}>
                {/* 标题 */}
                <View style={[theme.rowCenter]}>
                    <Text style={[theme.titleColor1, { fontSize: 24, }]}>
                        {title}
                    </Text>
                </View>
            </View>

            {/* 显示区域 */}
            <TouchableWithoutFeedback
                onPress={nextParagraph}>
                <View style={[{ flex: 1, paddingLeft: 2, paddingRight: 2, paddingTop: 2, backgroundColor: '#fff' }]}>
                    {/* 内容显示区域 */}
                    <View style={[{ backgroundColor: '#fff', height: "70%", paddingLeft: 12, paddingRight: 12, }]}>
                        <FlatList
                            data={currentTextList}
                            renderItem={renderText}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>

                    {/* 按钮区域 */}
                    <View style={{ padding: 12, height: "30%" }}>
                        <FlatList
                            data={showBtnList}
                            renderItem={renderBtn}
                            keyExtractor={(item, index) => item.title + index}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </HalfPanel>
    );

};

export default HalfSingle;

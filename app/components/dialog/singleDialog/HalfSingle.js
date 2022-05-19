import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
    Image
} from 'react-native';
import React from 'react';
import { ThemeContext } from '../../../constants';
import { HalfPanel } from '../../panel';
import { TextButton } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';

import ImageCapInset from 'react-native-image-capinsets-next';

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
                <View style={{ marginTop: 8 }}>
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
        <HalfPanel>
            {/* head */}
            <View style={[theme.rowCenter, theme.blockBgColor1, { paddingLeft: 12, paddingRight: 12, height: 50 }]}>
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
                <View style={[theme.blockBgColor2, { flex: 1, paddingLeft: 2, paddingRight: 2, paddingTop: 2, }]}>
                    {/* 内容显示区域 */}
                    <View style={[theme.blockBgColor3, { height: "70%" }]}>
                        <FlatList
                            ref={refFlatList}
                            data={currentTextList}
                            renderItem={renderText}
                            keyExtractor={(item, index) => item + index}
                            ListFooterComponent={() => <View style={{ height: 12 }} />}
                            onContentSizeChange={() => {
                                if (props.currentTextList.length > 0) {
                                    refFlatList.current.scrollToEnd({ animated: true })
                                }
                            }}
                        />
                    </View>

                    {/* 按钮区域 */}
                    <View style={{ padding: 12, height: "30%" }}>
                        <FlatList
                            data={showBtnList}
                            renderItem={renderBtn}
                            keyExtractor={(item, index) => item.title + index}
                        />
                        <View style={{ width: "100%", height: 50, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
                            <ImageCapInset
                                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, zindex: 999 }}
                                source={require('../../../../assets/button/40dpi.png')}
                                capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                            />
                            <Image resizeMode="stretch"
                            style={{ width: '100%', height: '100%', zIndex: -1, position: "absolute" }}
                                source={require('../../../../assets/frame/button_style1.png')} 
                                />
                            <Text style={{ zIndex: 1, fontSize: 20, color: "red" }}>sssss</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </HalfPanel>
    );

};

export default HalfSingle;

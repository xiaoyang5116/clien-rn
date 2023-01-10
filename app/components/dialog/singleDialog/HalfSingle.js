import {
    View,
    Text,
    TouchableWithoutFeedback,
    FlatList,
    Image,
    ImageBackground
} from 'react-native';
import React from 'react';
import { px2pd } from '../../../constants/resolution';
import { ThemeData } from '../../../constants';
import { HalfPanel } from '../../panel';
import { TextButton, BtnIcon } from '../../../constants/custom-ui';
import TextAnimation from '../../textAnimation';
import OptionComponents from '../../article/optionComponents';


const HalfSingle = (props) => {
    const theme = ThemeData();
    const {
        title,
        textAnimationType,
        nextParagraph,
        currentTextList,
        showBtnList,
        currentIndex,
        currentDialogueLength,
        nextDialogue,
        refFlatList,
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
                            style={theme.dialogFontColor}
                            isShowAllContent={currentIndex === index ? false : true}
                        >
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
        if (currentIndex >= currentDialogueLength) {
            if (item.btnType === undefined) {
                return (
                    <View style={{ marginTop: 8, justifyContent: 'center' }}>
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
            } else {
                return (
                    <View style={{ marginTop: 8, justifyContent: 'center' }}>
                        <OptionComponents
                            optionData={item}
                            btnType={item.btnType}
                            title={item.title}
                            disabled={item.disabled}
                            currentStyles={theme}
                            onPress={() => { nextDialogue(item) }}
                        />
                    </View>
                )
            }
        }
        return null;
    };
    return (
        <HalfPanel source={theme.dialogBg_2_img}
            style={{
                borderColor: "#333333",
                borderWidth: 1,
                borderRadius: 3,
            }}
        >
            {/* head */}
            <ImageBackground style={[theme.rowCenter, { paddingLeft: 12, paddingRight: 12, height: 50, }]}
                source={theme.dialogBg_2_header_img}
            >
                {/* 标题 */}
                <View style={[theme.rowCenter]}>
                    <Text style={[theme.dialogFontColor, { fontSize: 24, }]}>
                        {title}
                    </Text>
                </View>
            </ImageBackground>

            {/* 显示区域 */}
            <TouchableWithoutFeedback
                onPress={nextParagraph}>
                <View style={[{ flex: 1, paddingLeft: 2, paddingRight: 2, paddingTop: 2, }]}>
                    {/* 内容显示区域 */}
                    <View style={[{ height: "70%" }]}>
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
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </HalfPanel>
    );
};

export default HalfSingle;

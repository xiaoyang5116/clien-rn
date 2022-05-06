import { View, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import React, { useState } from 'react';
import { ThemeContext } from '../../../constants';


const FullSingle = props => {
    const theme = React.useContext(ThemeContext);
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
                    {props.title}
                </Text>
            </View>
            {/* 显示区域 */}
            <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
                <TouchableWithoutFeedback onPress={props.nextParagraph}>
                    <View style={{ flex: 1 }}>
                        {/* 内容显示区域 */}
                        <View style={{ height: '50%' }}>
                            <FlatList
                                data={props.currentTextList}
                                renderItem={props.renderText}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View
                            style={{ marginTop: 12, height: '50%', justifyContent: 'center' }}>
                            <FlatList
                                data={props.showBtnList}
                                renderItem={props.renderBtn}
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

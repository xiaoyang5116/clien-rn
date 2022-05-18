import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React, { useEffect } from 'react';

import { connect, action, EventKeys, ThemeContext } from '../../../constants';
import RootView from '../../RootView';

import { RButton } from '../_components';
import CustomParagraph from './CustomParagraph';


const SetParagraph = props => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props;

    const changeTypesetting = (itme) => {
        props.dispatch(action('ArticleModel/changeReaderStyle')(itme));
    };

    const Wire = props => {
        let line = [];
        for (let index = 0; index < props.num; index++) {
            line.push(
                <View
                    key={index}
                    style={[
                        styles.wire,
                        { backgroundColor: readerStyle.borderColor },
                    ]}></View>,
            );
        }
        return (
            <TouchableOpacity
                disabled={props.selected}
                style={[theme.readerSettingRow_box]}
                onPress={props.onPress}>
                <View
                    style={[
                        theme.readerSetting_border_2,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: props.selected
                                ? readerStyle.selectedBorderColor
                                : readerStyle.borderColor,
                        },
                    ]}>
                    <View
                        style={{
                            flex: 1,
                            transform: [{ scale: 0.5 }],
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}>
                        {line}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={theme.readerSettingRow}>
            <View style={theme.readerSettingRow_left_item}>
                <Wire
                    num={4}
                    selected={readerStyle.selectedTypesetting === 'typesetting_1'}
                    onPress={() => {
                        changeTypesetting({
                            selectedTypesetting: "typesetting_1",
                            lineHeight: readerStyle.typesetting_1.lineHeight,
                            paragraphSpacing: readerStyle.typesetting_1.paragraphSpacing,
                        });
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire
                    num={3}
                    selected={readerStyle.selectedTypesetting === 'typesetting_2'}
                    onPress={() => {
                        changeTypesetting({
                            selectedTypesetting: "typesetting_2",
                            lineHeight: readerStyle.typesetting_2.lineHeight,
                            paragraphSpacing: readerStyle.typesetting_2.paragraphSpacing,
                        });
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire
                    num={2}
                    selected={readerStyle.selectedTypesetting === 'typesetting_3'}
                    onPress={() => {
                        changeTypesetting({
                            selectedTypesetting: "typesetting_3",
                            lineHeight: readerStyle.typesetting_3.lineHeight,
                            paragraphSpacing: readerStyle.typesetting_3.paragraphSpacing,
                        });
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    title={'无'}
                    selected={readerStyle.selectedTypesetting === 'typesetting_4'}
                    onPress={() => {
                        changeTypesetting({
                            selectedTypesetting: "typesetting_4",
                            lineHeight: readerStyle.typesetting_4.lineHeight,
                            paragraphSpacing: readerStyle.typesetting_4.paragraphSpacing,
                        });
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_right_item}>
                <TouchableOpacity
                    style={[theme.readerSettingRow_box]}
                    onPress={() => {
                        props.openSecondaryMenu("CustomParagraph")
                    }}
                >
                    <Text style={[
                        theme.readerSetting_border_2,
                        {
                            borderColor: readerStyle.selectedTypesetting === '自定义排版' ? readerStyle.selectedBorderColor : readerStyle.borderColor,
                            backgroundColor: props.color,
                            overflow: 'hidden'
                        }
                    ]}>
                        自定义排版
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default connect(state => ({ ...state.ArticleModel }))(SetParagraph);

const styles = StyleSheet.create({
    wire: {
        width: 30,
        height: 5,
        borderRadius: 2,
        overflow: 'hidden',
    },
});

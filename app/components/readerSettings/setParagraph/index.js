import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import { connect, action, EventKeys, ThemeContext } from '../../../constants';
import RootView from '../../RootView';

import { RButton } from '../_components';
import CustomParagraph from './CustomParagraph';


const SetParagraph = props => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props;

    const changeTypesetting = (Typesetting, selectedTypesetting) => {
        props.dispatch(action('ArticleModel/changeTypesetting')({ Typesetting, selectedTypesetting }));
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
                        changeTypesetting(readerStyle.typesetting_1, 'typesetting_1');
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire
                    num={3}
                    selected={readerStyle.selectedTypesetting === 'typesetting_2'}
                    onPress={() => {
                        changeTypesetting(readerStyle.typesetting_2, 'typesetting_2');
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire
                    num={2}
                    selected={readerStyle.selectedTypesetting === 'typesetting_3'}
                    onPress={() => {
                        changeTypesetting(readerStyle.typesetting_3, 'typesetting_3');
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    title={'无'}
                    selected={readerStyle.selectedTypesetting === 'typesetting_4'}
                    onPress={() => {
                        changeTypesetting(readerStyle.typesetting_4, 'typesetting_4');
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_right_item}>
                <RButton
                    title={'自定义排版'}
                    selected={readerStyle.selectedTypesetting === '自定义排版'}
                    onPress={() => {
                        props.openSecondaryMenu({ type: "CustomParagraph" })
                        const key = RootView.add(<CustomParagraph onClose={() => { RootView.remove(key) }} />)
                    }}
                />
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

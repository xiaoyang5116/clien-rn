import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../constants";

import { TButton } from './_components';

const ChangeFont = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props

    return (
        <View style={theme.readerSettingRow}>
            <View style={theme.readerSettingRow_left_item}>
                <TButton
                    disabled={(readerStyle.contentSize <= 10)}
                    title={"A-"}
                    onPress={() => {
                        props.dispatch(action('ArticleModel/changeFontSize')({ type: "reduce", action: 1 }))
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Text style={{ fontSize: 14, color: readerStyle.color }}>
                    {readerStyle.contentSize}
                </Text>
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <TButton
                    title={"A+"}
                    disabled={(readerStyle.contentSize >= 40)}
                    onPress={() => {
                        props.dispatch(action('ArticleModel/changeFontSize')({ type: "increase", action: 1 }))
                    }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <TButton title={"无"} />
            </View>

            <View style={theme.readerSettingRow_right_item}>
                <TButton
                    title={"自定义字体"}
                    onPress={() => { }}
                />
            </View>

        </View>
    )
}

export default connect(state => ({ ...state.ArticleModel }))(ChangeFont);

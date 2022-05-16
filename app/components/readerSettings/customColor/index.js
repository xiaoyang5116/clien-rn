import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../../constants";

import { RButton } from '../_components';

const matchColor = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props

    const changeMatchColor = ({ color, bgColor }) => {
        props.dispatch(action('ArticleModel/changeMatchColor')({ color: color, bgColor: bgColor }));
    }

    return (
        <View style={theme.readerSettingRow}>
            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor_1.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_1.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_1) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor_2.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_2.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_2) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor_3.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_3.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_3) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor_4.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_4.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_4) }}
                />
            </View>

            <View style={theme.readerSettingRow_right_item}>
                <RButton
                    title={"自定义配色"}
                    onPress={() => { }}
                />
            </View>

        </View>
    )
}

export default connect(state => ({ ...state.ArticleModel }))(matchColor);
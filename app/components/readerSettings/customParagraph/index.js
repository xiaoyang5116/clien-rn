import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../../constants";

import { RButton } from '../_components';




const CustomParagraph = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props

    const changeMatchColor = ({ color, bgColor }) => {
        props.dispatch(action('ArticleModel/changeMatchColor')({ color: color, bgColor: bgColor }));
    }

    const Wire = (props) => {
        const Line = (props) => {
            for (let index = 0; index < props.num; index++) {
                return (
                    <View style={{
                        width: 20,
                        height: 5,
                        borderRadius: 2,
                        marginTop: 12,
                        backgroundColor: readerStyle.borderColor,
                        overflow: 'hidden',
                    }}></View>
                )
            }
        }
        return (
            <View>
                <Line num={3} />
            </View>
        )
    }

    return (
        <View style={theme.readerSettingRow}>
            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor1.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor1.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor1) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor2.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor2.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor2) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor3.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor3.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor3) }}
                />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    color={readerStyle.matchColor4.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor4.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor4) }}
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

export default connect(state => ({ ...state.ArticleModel }))(CustomParagraph);
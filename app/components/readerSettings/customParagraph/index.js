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
        console.log('changeMatchColor', color, bgColor)
        // props.dispatch(action('ArticleModel/changeMatchColor')({ color: color, bgColor: bgColor }));
    }

    const Wire = (props) => {
        let line = []
        for (let index = 0; index < props.num; index++) {
            line.push(<View key={index} style={[styles.wire, { backgroundColor: readerStyle.borderColor }]}></View>)
        }
        return (
            <TouchableOpacity
                disabled={props.selected}
                style={[theme.readerSettingRow_box]}
                onPress={props.onPress}
            >
                <View style={[
                    theme.readerSetting_border_2,
                    {
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: props.selected ? readerStyle.selectedBorderColor : readerStyle.borderColor,
                    }
                ]}>
                    <View style={{
                        flex: 1,
                        transform: [{ scale: 0.5 }],
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}>
                        {line}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={theme.readerSettingRow}>
            <View style={theme.readerSettingRow_left_item}>
                <Wire num={4} />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire num={3} />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <Wire num={2} />
            </View>

            <View style={theme.readerSettingRow_left_item}>
                <RButton
                    title={"无"}
                />
            </View>

            <View style={theme.readerSettingRow_right_item}>
                <RButton
                    title={"自定义排版"}
                    onPress={() => { }}
                />
            </View>

        </View>
    )
}

export default connect(state => ({ ...state.ArticleModel }))(CustomParagraph);


const styles = StyleSheet.create({
    wire: {
        width: 30,
        height: 5,
        borderRadius: 2,
        overflow: 'hidden',
    }
})
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../../constants";

import { RButton, TButton } from '../_components';

const matchColor = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props

    const changeMatchColor = (itme) => {
        props.dispatch(action('ArticleModel/changeReaderStyle')(itme));
    }

    return (
        <View style={theme.readerSettingRow}>
            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_1.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_1.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_1) }}
                />
            </View>

            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_2.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_2.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_2) }}
                />
            </View>

            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_3.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_3.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_3) }}
                />
            </View>

            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_4.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_4.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_4) }}
                />
            </View>
            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_5.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_5.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_5) }}
                />
            </View>

            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_6.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_6.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_6) }}
                />
            </View>
            <View style={styles.colorItem}>
                <TButton
                    bg={readerStyle.matchColor_7.bgColor}
                    selected={(readerStyle.bgColor === readerStyle.matchColor_7.bgColor)}
                    onPress={() => { changeMatchColor(readerStyle.matchColor_7) }}
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

const styles = StyleSheet.create({
    colorItem: {
        width: "6%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    }
})
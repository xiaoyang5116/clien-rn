import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../constants";

const ChangeFont = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props

    return (
        <View style={styles.row}>
            <View style={styles.leftBox}>
                <TouchableOpacity
                    disabled={(readerStyle.contentSize <= 10) ? true : false}
                    onPress={() => {
                        props.dispatch(action('ArticleModel/changeFontSize')({ type: "reduce", action: 1 }))
                    }}
                >
                    <View style={[styles.border1, styles.leftItem, theme1.BorderColor,
                    { opacity: (readerStyle.contentSize <= 10) ? 0.5 : 1 }
                    ]}>
                        <Text style={[styles.fontSizeText,]}>A-</Text>
                    </View>
                </TouchableOpacity>
                <View style={[styles.leftItem]}>
                    <Text style={[styles.fontSizeText,]}>{readerStyle.contentSize}</Text>
                </View>
                <TouchableOpacity
                    disabled={(readerStyle.contentSize >= 40) ? true : false}
                    onPress={() => {
                        props.dispatch(action('ArticleModel/changeFontSize')({ type: "increase", action: 1 }))
                    }}>
                    <View style={[styles.border1, styles.leftItem, theme1.BorderColor,
                    { opacity: (readerStyle.contentSize >= 40) ? 0.5 : 1 }
                    ]}>
                        <Text style={[styles.fontSizeText,]}>A+</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.leftItem, theme1.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>无</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.rightBox]}>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.rightItem, theme1.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>自定义字体</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default connect(state => ({ ...state.ArticleModel }))(ChangeFont);

const styles = StyleSheet.create({
    border1: {
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    fontSizeText: {
        fontSize: 14,
    },
    row: {
        width: '100%',
        height: 50,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "red"
    },
    leftBox: {
        width: '70%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
    },
    leftItem: {
        // backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightBox: {
        width: '30%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
    },
    rightItem: {
        justifyContent: "center",
        alignItems: 'center',
    },



});

const theme1 = StyleSheet.create({
    bgColor: {
        backgroundColor: '#faf3e8',
    },
    BorderColor: {
        borderColor: "#eee7dd",
    },


});
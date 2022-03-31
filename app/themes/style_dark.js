/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { StyleSheet } from '../constants';
import sharedStyles from './sharedStyles';

const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    ...sharedStyles,
    /* 通用视图容器 */
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    /* 按钮样式 */
    button: {
        color: '#424242',
        backgroundColor: '#CCC'
    },
    /** ================================ */
    /**             选择框                */
    /** ================================ */
    /* 位置栏 */
    positionBar: {
        alignSelf: 'stretch'
    },
    /* 对话框内位置 */
    positionLabel: {
        fontSize: 18,
        padding: 10,
        textAlign: 'left',
    },
    /* 对话框内位置 */
    datetimeLabel: {
        fontSize: 18,
        padding: 10,
    },
    /* 对话框 */
    chatContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10
    },
    /* 对话项列表 */
    chatList: {
        alignSelf: 'stretch'
    },
    /* 对话框头部 */
    chatHeader: {
        fontSize: 18,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        backgroundColor: "#fff"
    },
    /* 对话选项框条目 */
    chatItem: {
        backgroundColor: "#CCC",
        paddingTop: 2,
        paddingBottom: 2,
        marginVertical: 2
    },
    /* 导航栏样式 */
    navigation: {
        primary: '#ff2d55',
        background: '#5e5e5e',
        card: '#212121',
        text: '#ffffff',
        border: '#c7c7cc',
        notification: '#ff453a',
    },
    /** ================================ */
    /**             对话框                */
    /** ================================ */
    dlgCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dlgParent: {
        width: 300,
        height: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    dlgTitle: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },
    dlgTitleContainer: {
        flex: 1,
        marginTop: 3,
        width: 280,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        justifyContent: "center"
    },
    dlgContent: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
    dlgContentContainer: {
        flex: 3,
        padding: 10,
        justifyContent: "space-around"
    },
    dlgBottomBanner: {
        width: 280,
        marginBottom: 3
    },
    /** ================================ */
    /**             旁白                 */
    /** ================================ */
    asideCenter: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
    },
    // 黑旁白 begin
    asideParent1: {
        backgroundColor: '#0b0b0b',
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-start',
        flexFlow: "column wrap",
    },
    asideTitle1: {
        fontSize: 20,
        color: '#dfe4ea',
        textAlign: 'left',
    },
    asideContent1: {
        fontSize: 20,
        color: '#dfe4ea',
        textAlign: 'center',
    },
    // 黑旁白 end

    // 白旁白 begin
    asideParent2: {
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingLeft: 50,
        paddingRight: 50,
        marginBottom: 15,
    },
    asideTitleContainer: {
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    asideContentContainer: {

    },
    asideBottomContainer: {
        justifyContent: "flex-start",
        marginTop: 15,
    },
    asideBottomBanner: {
        width: 280,
    },
    asideTitle: {
        fontSize: 24,
        color: '#000',
        textAlign: 'left',
    },
    asideContent: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center'
    },
    // 白旁白 end
});

export default styles;
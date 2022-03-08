/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { StyleSheet } from '../constants';

const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
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
        flex:1, 
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
        width:300,
        height:300,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    asideParent1: {
        width:300,
        height:300,
        backgroundColor: '#CCC',
        borderRadius: 10
    },
    asideParent2: {
        width:300,
        height:300,
        borderRadius: 10
    },
    asideTitleContainer: {
        flex: 1, 
        marginTop: 3, 
        width: 280, 
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    asideContentContainer: {
        flex: 3, 
        // padding: 10, 
        justifyContent: "space-around"
    },
    asideBottomContainer: {
        flex: 2, 
        justifyContent: 'center'
    },
    asideBottomBanner: {
        width: 280, 
        marginBottom: 3
    },
    asideTitle: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
    },
    asideContent: {
        margin: 10,
        fontSize: 24,
        color: 'black',
        textAlign: 'center'
    },
});

export default styles;
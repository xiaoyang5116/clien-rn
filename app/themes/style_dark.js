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
    /* 通用视图容器 */
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    /* 按钮样式 */
    button: {
        color: '#424242',
        backgroundColor: '#CCC'
    },
});

export default styles;
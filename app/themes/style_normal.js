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

// 按钮颜色
const btnColor = '#bcfefe';  // 青色
const btnColor2 = '#ede7db';  // 淡米白色
// 背景颜色
const bgColor = '#003964';  // 蓝色
const bgColor2 = '#e8ddcc';  // 米白色
// 文字颜色
const textColor = '#000';  // 黑色




const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 按钮样式 */
    button: {
        color: btnColor,
        backgroundColor: bgColor,
    },
    /** ================================ */
    /**             选择框                */
    /** ================================ */
    /* 对话选项框条目 */
    chatItem: {
        backgroundColor: bgColor,
        paddingTop: 2,
        paddingBottom: 2,
        marginVertical: 2
    },
    /* 导航栏样式 */
    navigation: {
        primary: '#ff2d55',
        background: '#f2f2f2',
        card: '#ffffff',
        text: '#000000',
        border: '#c7c7cc',
        notification: '#ff453a',
    },
});

export default styles;
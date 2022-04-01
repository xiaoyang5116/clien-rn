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
    /* 通用样式 */
    ...sharedStyles,

    /* 按钮样式 */
    button: {
        color: '#424242',
        backgroundColor: '#CCC'
    },
    /** ================================ */
    /**             选择框                */
    /** ================================ */
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
});

export default styles;
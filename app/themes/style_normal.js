
import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

// 文字颜色
const textColor = '#000';  // 黑色 6a655e

/**
 * 按钮颜色
 * btnColor: 字体颜色,
 * btnBgColor: 背景颜色,
 */
const btnColor = '#bcfefe';  // 青色
const btnBgColor = '#003964';  // 蓝色
const btnColor2 = '#ede7db';  // 淡米白色

/**
 * 背景颜色
 */
const bgColor = '#003964';  // 蓝色
const bgColor2 = '#e8ddcc';  // 米白色

/**
 * header 样式
 * headerTextColor 文字颜色
 * headerBgColor 背景颜色
 */
const headerTextColor = '#6a655e';  // 深灰色
const headerBgColor = '#e8ddcc';  // 米白色




const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* header */
    headerBg: {
        backgroundColor: headerBgColor,
    },
    headerText: {
        color: headerTextColor,
    },

    /* 按钮样式 */
    button: {
        color: btnColor,
        backgroundColor: btnBgColor,
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
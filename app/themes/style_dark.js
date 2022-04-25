
import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

/** 主题色：黑色 */

/**
 * 背景颜色
 *      页面背景 bgColor1: #5e5e5e
 *      区块背景 bgColor2: #4d4d4d
 */
 const bgColor1 = '#5e5e5e';
 const bgColor2 = '#4d4d4d';

/**
 * 通用按钮
 */
 const btnFontColor = '#eee';
 const btnBackgroundColor = '#003964';

/**
 * 文字颜色
 *      标题
 *          一级标题 titleColor: #f0f0f0
 *      内容
 *          一级内容 contentColor: #f0f0f0
 */
// 标题
const titleColor1 = '#f0f0f0';

// 内容
const contentColor = '#f0f0f0';


const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 页面背景颜色 */
    pageBg: {
        backgroundColor: bgColor1,
    },

    /* header */
    headerBgColor: {
        backgroundColor: bgColor2,
    },
    headerTextColor: {
        color: contentColor,
    },

    /** ================================ */
    /**             底部                 */
    /** ================================ */
    footerBgColor: {
        backgroundColor: bgColor2,
    },
    footerTextColor: {
        color: contentColor,
    },

    /* 按钮样式 */
    button: {
        color: btnFontColor,
        backgroundColor: btnBackgroundColor,
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

import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

/**
 * 背景颜色
 */
const pageBgColor = '#5e5e5e' // 灰白色

/**
 * 通用按钮
 */
 const btnFontColor = '#eee';
 const btnBackgroundColor = '#003964';

/**
 * header 样式
 * headerTextColor 文字颜色
 * headerBgColor 背景颜色
 */
 const headerTextColor = '#fff';  // 深灰色
 const headerBgColor = '#212121';  // 米白色


const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 页面背景颜色 */
    pageBg: {
        backgroundColor: pageBgColor,
    },

    /* header */
    headerBg: {
        backgroundColor: headerBgColor,
    },
    headerTextColor: {
        color: headerTextColor,
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
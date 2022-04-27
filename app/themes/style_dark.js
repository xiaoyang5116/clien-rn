
import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

/** 主题色：黑色 */

/**
 * 通用按钮
 */
const btnFontColor = '#eee';
const btnBackgroundColor = '#003964';


/** ================================ */
/**             背景颜色              */
/** ================================ */
/* 页面背景 */
const pageColor1 = '#5e5e5e';  // 灰色
/* 区块背景 */
const blockColor1 = '#4d4d4d';  // 深灰色
const blockColor2 = '#4d4d4d';  // 深灰色


/** ================================ */
/**             文字颜色              */
/** ================================ */
/* 标题 */
const titleColor1 = '#f0f0f0';  //淡灰色
const titleColor2 = '#f0f0f0';  //淡灰色
/* 内容 */
const contentColor1 = '#f0f0f0';  //淡灰色
const contentColor2 = '#989898';  //暗灰色


const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 页面背景颜色 */
    pageBg: {
        backgroundColor: pageColor1,
    },

    /* header */
    headerBgColor: {
        backgroundColor: blockColor1,
    },
    headerTextColor1: {
        color: titleColor1,
    },
    headerTextColor2: {
        color: titleColor2,
    },

    /* 按钮样式 */
    button: {
        color: btnFontColor,
        fontColor: btnFontColor,
        backgroundColor: btnBackgroundColor,
    },

    /** ================================ */
    /**             邮件样式              */
    /** ================================ */
    /* 邮件tab 选中 */
    mailTabBgSelected: {
        backgroundColor: blockColor2,
    },
    mailTabTextSelected: {
        color: contentColor1,
    },
    /* 邮件tab 未选中 */
    mailTabBgUnselected: {
        backgroundColor: blockColor1,
    },
    mailTabTextUnselected: {
        color: contentColor2,
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
    /** ================================ */
    /**            图片资源               */
    /** ================================ */
    profileItemImage: require('../../assets/button/profile_item.2.png'),
    profileItemImageSelected: require('../../assets/button/profile_item_selected.2.png'),
});

export default styles;
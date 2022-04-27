
import { StyleSheet } from 'react-native';
import sharedStyles from './sharedStyles';

/**
* 通用按钮
*/
const btnFontColor = '#424242';
const btnBackgroundColor = '#eee';


/** ================================ */
/**             背景颜色              */
/** ================================ */
/* 页面背景 */
const pageColor1 = '#f2f2f2';  // 淡灰色
/* 区块背景 */
const blockColor1 = '#e8ddcc';  // 米白色
const blockColor2 = '#003964';  // 蓝色


/** ================================ */
/**             文字颜色              */
/** ================================ */
/* 标题 */
const titleColor1 = '#6a655e';  // 深棕色
const titleColor2 = '#6a655e';  // 深棕色
/* 内容 */
const contentColor1 = '#fff';  // 白色
const contentColor2 = '#868076';  // 淡棕色



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
        backgroundColor: blockColor2,
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
    /** ================================ */
    /**            图片资源               */
    /** ================================ */
    profileItemImage: require('../../assets/button/profile_item.png'),
    profileItemImageSelected: require('../../assets/button/profile_item_selected.png'),
});

export default styles;
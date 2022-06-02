
import { StyleSheet } from 'react-native';
import { px2pd } from '../constants/resolution';
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
const pageBgColor1 = '#f2f2f2';  // 淡灰色

/* 区块背景 */
const blockBgColor1 = '#e8d2b0';  // 深米白色
const blockBgColor2 = '#e8ddcc';  // 米白色
const blockBgColor3 = '#eee7dd';  // 淡米色


/* 按钮背景 */
const btnBgColor1 = '#003964';  // 蓝色
const btnBgColor2 = '#e8ddcc';  // 米白色

/* 提示背景 */
const tipBgColor1 = '#d3c2aa';  // 淡米色

/* 边框背景 */
// const lineColor1 = 'gray';  // 灰色

/** ================================ */
/**             文字颜色              */
/** ================================ */
/* 标题 */
const titleColor1 = '#6a655e';  // 深棕色
const titleColor2 = '#6a655e';  // 深棕色
const titleColor3 = '#d86362';  // 淡红色

/* 内容 */
const contentColor1 = '#f2f2f2';  // 淡灰色
const contentColor2 = '#868076';  // 淡棕色
const contentColor3 = '#6a655e';  // 深棕色




const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    /* 页面背景颜色 */
    pageBgColor1: {
        backgroundColor: pageBgColor1,
    },

    /* 区块背景 */
    blockBgColor1: {
        backgroundColor: blockBgColor1,
    },
    blockBgColor2: {
        backgroundColor: blockBgColor2,
    },

    /* 按钮背景 */
    btnBgColor1: {
        backgroundColor: btnBgColor1,
    },
    btnBgColor2: {
        backgroundColor: btnBgColor2,
    },
    blockBgColor3:{
        backgroundColor: blockBgColor3,
    },

    /* 提示背景 */
    tipBgColor1: {
        backgroundColor: tipBgColor1,
    },

    /* 标题颜色 */
    titleColor1: {
        color: titleColor1,
    },
    titleColor2: {
        color: titleColor2,
    },
    titleColor3: {
        color: titleColor3,
    },

    /* 内容颜色 */
    contentColor1: {
        color: contentColor1,
    },
    contentColor2: {
        color: contentColor2,
    },
    contentColor3: {
        color: contentColor3,
    },

    /* 按钮样式 */
    button: {
        color: btnFontColor,
        fontColor: btnFontColor,
        backgroundColor: btnBackgroundColor,
    },

    /* 选项样式 */
    options: {
        fontColor: '#8addff',
    },

    /* 选项按钮宽高 */
    tabBottomImgStyle: {
        width: px2pd(115),
        height: px2pd(200),
    },

    /* 选项按钮文本 */
    tabBottomLabelStyle: {
        left: 10, 
        top: 10
    },

    /* 城镇地图按钮标签样式 */
    townMapButtonLabel: {
        color: '#fff',
    },

    /** ================================ */
    /**             邮件样式              */
    /** ================================ */
    mailTips: {
        color: contentColor2,
        backgroundColor: blockBgColor2,
    },

    /** ================================ */
    /**             选择框                */
    /** ================================ */
    /* 对话选项框条目 */
    chatItem: {
        // backgroundColor: btnBgColor1,
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
    tabBottomImage: require('../../assets/themes/blue/button/tab_normal.png'),
    optionButtonImage: require("../../assets/themes/blue/button/option_button.png"),
    propSelectedImage: require("../../assets/themes/blue/button/prop_selected.png"),
    townMapButtonImage: require("../../assets/themes/blue/button/town_button.png"),
});

export default styles;
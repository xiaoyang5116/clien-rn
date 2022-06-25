
import { StyleSheet } from 'react-native';
import { px2pd } from '../constants/resolution';
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
const pageBgColor1 = '#5e5e5e';  // 灰色

/* 区块背景 */
const blockBgColor1 = '#4d4d4d';  // 深灰色
const blockBgColor2 = '#616161';  // 深灰色
const blockBgColor3 = '#525252';  // 暗灰色

/* 按钮背景 */
const btnBgColor1 = '#525252';  // 暗灰色
const btnBgColor2 = '#4d4d4d';  // 深灰色

/* 提示背景 */
const tipBgColor1 = '#525252';  // 暗灰色

/* 边框背景 */
// const lineColor1 = '#';  // 

/** ================================ */
/**             文字颜色              */
/** ================================ */
/* 标题 */
const titleColor1 = '#f0f0f0';  // 偏白色
const titleColor2 = '#f0f0f0';  // 偏白色
const titleColor3 = '#d86362';  // 淡红色

/* 内容 */
const contentColor1 = '#f0f0f0';  //偏白色
const contentColor2 = '#989898';  //淡灰色
const contentColor3 = '#f0f0f0';  //偏白色



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
    blockBgColor3: {
        backgroundColor: blockBgColor3,
    },

    /* 按钮背景 */
    btnBgColor1: {
        backgroundColor: btnBgColor1,
    },
    btnBgColor2: {
        backgroundColor: btnBgColor2,
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
        fontColor: btnFontColor,
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
        // backgroundColor: "#CCC",
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
    /**            图片大小定义            */
    /** ================================ */
    blockBg_2_size: {
        width: px2pd(450),
        height: px2pd(299),
    },
    blockBg_3_size: {
        width: px2pd(408),
        height: px2pd(111),
    },
    headerBg_size: {
        width: px2pd(1170),
        height: px2pd(161),
    },

    /** ================================ */
    /**            图片资源               */
    /** ================================ */
    profileItemImage: require('../../assets/button/profile_item.2.png'),
    profileItemImageSelected: require('../../assets/button/profile_item_selected.2.png'),
    profileBg: require('../../assets/themes/dark/bg/setting.png'),
    tabBottomImage: require('../../assets/themes/dark/button/tab_normal.png'),
    optionButtonImage: require("../../assets/themes/dark/button/option_button.png"),
    propSelectedImage: require("../../assets/themes/dark/button/prop_selected.png"),
    townMapButtonImage: require("../../assets/themes/dark/button/town_button.png"),
    LongTBBorderImage: require("../../assets/themes/dark/button/long_text_button_border.png"),
    LongTBBgImage: require("../../assets/themes/dark/button/long_text_button_bg.png"),
    tabBannerBg: require("../../assets/themes/dark/tab/tab_banner_bg.png"),
    headerBg: require("../../assets/themes/dark/header/settiing_bg.png"),

    // 按钮
    btnPattern_1_img: require("../../assets/themes/dark/button/btn_pattern1.png"),
    btnPattern_2_img: require("../../assets/themes/dark/button/btn_pattern2.png"),

    // 对话框border
    dialogBorder_1_img: require('../../assets/themes/dark/bg/border1.png'),
    dialogBg_1_img: require('../../assets/themes/dark/bg/dialog_bg1.png'),

    // 通用花纹
    pattern_1_img: require('../../assets/themes/dark/bg/border1.png'),

    // block
    blockBg_1_img: require('../../assets/themes/dark/bg/block_bg1.png'),
    blockBg_2_img: require('../../assets/themes/dark/bg/block_bg2.png'),
    blockBg_3_img: require('../../assets/themes/dark/bg/block_bg3.png'),
    blockBg_4_img: require('../../assets/themes/dark/bg/block_bg4.png'),
    blockBg_5_img: require('../../assets/themes/dark/bg/block_bg5.png'),
});

export default styles;
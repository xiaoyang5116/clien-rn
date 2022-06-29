
import { StyleSheet } from 'react-native';
import { px2pd } from '../constants/resolution';
import sharedStyles from './sharedStyles';


/*** 主图色: 蓝色 */
// 默认颜色
const defaultFontColor = "#000";
const defaultBgColor = "#e0e9ed";

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
const titleColor1 = '#000';  // 深棕色
const titleColor2 = '#6a655e';  // 深棕色
const titleColor3 = '#d86362';  // 淡红色

/* 内容 */
const contentColor1 = '#f2f2f2';  // 淡灰色
const contentColor2 = '#868076';  // 淡棕色
const contentColor3 = '#6a655e';  // 深棕色

// 对话框
const dialogFontColor = "#000";  // 黑色



const styles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    /* 通用样式 */
    ...sharedStyles,

    // 默认
    default: {
        color: defaultFontColor,
        backgroundColor: defaultBgColor,
    },

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
    blockBgColor3: {
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
    dialogFontColor: {
        color: dialogFontColor
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
    options_2: {
        color: '#fff',
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
        width: px2pd(1074),
        height: px2pd(114),
    },


    /** ================================ */
    /**            图片资源               */
    /** ================================ */
    profileItemImage: require('../../assets/button/profile_item.2.png'),
    profileItemImageSelected: require('../../assets/button/profile_item_selected.2.png'),
    profileBg: require('../../assets/themes/blue/bg/setting.png'),
    tabBottomImage: require('../../assets/themes/blue/button/tab_normal.png'),
    optionButtonImage: require("../../assets/themes/blue/button/option_button.png"),
    propSelectedImage: require("../../assets/themes/blue/button/prop_selected.png"),
    townMapButtonImage: require("../../assets/themes/blue/button/town_button.png"),
    LongTBBorderImage: require("../../assets/themes/blue/button/long_text_button_border.png"),
    LongTBBgImage: require("../../assets/themes/blue/button/long_text_button_bg.png"),
    tabBannerBg: require("../../assets/themes/blue/tab/tab_banner_bg.png"),
    headerBg: require("../../assets/themes/blue/header/settiing_bg.png"),

    // 按钮
    btnPattern_1_img: require("../../assets/themes/blue/button/btn_pattern1.png"),
    btnPattern_2_img: require("../../assets/themes/blue/button/btn_pattern2.png"),

    // 对话框
    dialogBorder_1_img: require('../../assets/themes/blue/bg/border1.png'),
    dialogBg_1_img: require('../../assets/themes/blue/bg/dialog_bg1.png'),
    dialogBg_2_img: require('../../assets/themes/blue/bg/dialog_bg2.png'),
    dialogBg_2_header_img: require('../../assets/themes/blue/bg/dialog_bg2_header.png'),
    dialogBg_2_footer_img: require('../../assets/themes/blue/bg/dialog_bg2_footer.png'),


    // 通用花纹
    pattern_1_img: require('../../assets/themes/blue/bg/border1.png'),

    // block
    blockBg_1_img: require('../../assets/themes/blue/bg/block_bg1.png'),
    blockBg_2_img: require('../../assets/themes/blue/bg/block_bg2.png'),
    blockBg_3_img: require('../../assets/themes/blue/bg/block_bg3.png'),
    blockBg_4_img: require('../../assets/themes/blue/bg/block_bg4.png'),
    blockBg_5_img: require('../../assets/themes/blue/bg/block_bg5.png'),
    blockBg_6_img: require('../../assets/themes/blue/bg/block_bg6.png'),

    // icon
    check_1_img: require('../../assets/themes/blue/icon/hook.png'),
});

export default styles;
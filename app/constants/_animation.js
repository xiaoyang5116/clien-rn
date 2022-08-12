// ===============================
// 动画提示相关配置
// ===============================

// 动效类型
export const SHCOK = 'shock';
export const EDGE_LIGHT = 'edge_light';
export const SCREEN_CENTER_STRETCH = 'screen_center_stretch';
export const FLASH_BUXUE = "FlashBuXue"
export const ONOMATOPOEIA = "Onomatopoeia"
export const KNIFELIGHT = "knifeLight"


// 震屏
const shcok_1 = 'slightShock';
// const shcok_2 = '震屏2';
// const shcok_3 = '震屏3';
// const shcok_4 = '震屏4';

// =========边缘闪烁
// 边缘闪烁红
const edge_light_red = require('../../assets/edge_light/red.png');
// 边缘闪烁绿
const edge_light_green = require('../../assets/edge_light/green.png');
// 边缘闪烁蓝
const edge_light_blue = require('../../assets/edge_light/blue.png');
// 边缘闪烁白
const edge_light_white = require('../../assets/edge_light/white.png');

// =========刀光
function knifeLightAction(type) {
    const DATA = [
        { type: "拔刀", source: require('../../assets/animations/knifeLight/badao.png') },
        { type: "飞卷刀光1", source: require('../../assets/animations/knifeLight/feijuandaoguang_1.png') },
        { type: "飞卷刀光2", source: require('../../assets/animations/knifeLight/feijuandaoguang_2.png') },
        { type: "剑光1", source: require('../../assets/animations/knifeLight/jiangaung_1.webp') },
    ]
    return DATA.find(item => item.type === type)
}



// ========= 屏幕中心 图片伸缩
// 通关1
const pass_1 = require('../../assets/notice/pass_1.png');
const pass_2 = require('../../assets/animations/onomatopoeia/feiwu.png');

// ==========动画动作
export const animationAction = type => {
    switch (type) {
        case "震屏1":
            return {
                type: SHCOK,
                action: shcok_1,
            };
        case "边缘闪烁红":
            return {
                type: EDGE_LIGHT,
                action: edge_light_red,
            };
        case "边缘闪烁绿":
            return {
                type: EDGE_LIGHT,
                action: edge_light_green,
            };
        case "边缘闪烁蓝":
            return {
                type: EDGE_LIGHT,
                action: edge_light_blue,
            };
        case "边缘闪烁白":
            return {
                type: EDGE_LIGHT,
                action: edge_light_white,
            };
        case "盖章过关":
            return {
                type: SCREEN_CENTER_STRETCH,
                action: pass_1,
            };
        case "闪烁补血":
            return {
                type: FLASH_BUXUE,
                action: edge_light_green,
            };
        case "砰砰":
            return {
                type: ONOMATOPOEIA,
                typeId: 1,
            };
        case "嗖嗖":
            return {
                type: ONOMATOPOEIA,
                typeId: 2,
            };
        case "啊湫":
            return {
                type: ONOMATOPOEIA,
                typeId: 3,
            };
        case "啊!":
            return {
                type: ONOMATOPOEIA,
                typeId: 4,
            };
        case "呼呼":
            return {
                type: ONOMATOPOEIA,
                typeId: 5,
            };
        case "哐当":
            return {
                type: ONOMATOPOEIA,
                typeId: 6,
            };
        case "嘎吱":
            return {
                type: ONOMATOPOEIA,
                typeId: 7,
            };
        case "隔~":
            return {
                type: ONOMATOPOEIA,
                typeId: 8,
            };
        case "嘣~":
            return {
                type: ONOMATOPOEIA,
                typeId: 9,
            };
        case "闪闪闪":
            return {
                type: ONOMATOPOEIA,
                typeId: 10,
            };
        case "废物":
            return {
                type: SCREEN_CENTER_STRETCH,
                action: pass_2,
            };
        case "谁!!!":
            return {
                type: ONOMATOPOEIA,
                typeId: 11,
            };
        case "吼吼吼":
            return {
                type: ONOMATOPOEIA,
                typeId: 12,
            };
        case "噗嗤":
            return {
                type: ONOMATOPOEIA,
                typeId: 13,
            };
        case "拔刀":
            return {
                type: KNIFELIGHT,
                action: knifeLightAction("拔刀")
            };
        case "飞卷刀光1":
            return {
                type: KNIFELIGHT,
                action: knifeLightAction("飞卷刀光1")
            };
        case "飞卷刀光2":
            return {
                type: KNIFELIGHT,
                action: knifeLightAction("飞卷刀光2")
            };
        case "剑光1":
            return {
                type: KNIFELIGHT,
                action: knifeLightAction("剑光1")
            };
        default:
            return null
    }
};

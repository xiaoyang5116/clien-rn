// ===============================
// 动画提示相关配置
// ===============================

// 动效类型
export const SHCOK = 'shock';
export const EDGE_LIGHT = 'edge_light';
export const SCREEN_CENTER_STRETCH = 'screen_center_stretch';

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

// ========= 屏幕中心 图片伸缩
// 通关1
const pass_1 = require('../../assets/notice/pass_1.png');

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
    }
};

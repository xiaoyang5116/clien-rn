
require('./functions');

export {
    Component,
    PureComponent
} from 'react';

export {
    StyleSheet,
    Dimensions,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';

export {
    connect,
    Provider
} from 'react-redux';

export {
    create as dva_create
} from 'dva-core';

export * from './keys';

import { Dimensions } from 'react-native';

// 是否调试模式
export const DEBUG_MODE = true;

// 输出调试信息
export const debugMessage = (s, ...args) => { if (DEBUG_MODE) console.debug('' + ((typeof (s) == 'string') ? s.format(args) : s)); };

// 输出错误信息
export const errorMessage = (s, ...args) => { if (DEBUG_MODE) console.error('' + ((typeof (s) == 'string') ? '' + s.format(args) : s)); };

// 屏幕特性
export const getWindowSize = () => { return Dimensions.get('window'); };

// 定义DVA Action.
export const action = type => payload => ({ type, payload });

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

// 下到上平滑
export const BOTTOM_TOP_SMOOTH = "BottomToTopSmooth"
// 下到上停顿
export const BOTTOM_TOP = "BottomToTop"
// 中间到上
export const CENTER_TOP = "CenterToTop"
// 左到右
export const LEFT_RIGHT = "LeftToRight"

export const toastType = (type) => {
    switch (type) {
        case "下到上平滑":
            return BOTTOM_TOP_SMOOTH
        case "下到上停顿":
            return BOTTOM_TOP
        case "中间到上":
            return CENTER_TOP
        case "左到右":
            return LEFT_RIGHT
        default:
            return BOTTOM_TOP
    }
}

// 获取 assets/avatar 中的头像
export const getAvatar = (avatar) => {
    const avatarList = [
        { id: "1", img: '1.jpg'},
        { id: "2", img: '2.jpg'},
    ]
    return avatarList.find(a => a.id === avatar).img
}



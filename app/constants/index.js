
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
export const debugMessage = (s, ...args) => { if (DEBUG_MODE) console.debug((typeof(s) == 'string') ? s.format(args) : s); };

// 输出错误信息
export const errorMessage = (s, ...args) => { if (DEBUG_MODE) console.error((typeof(s) == 'string') ? s.format(args) : s); };

// 屏幕特性
export const getWindowSize = () => { return Dimensions.get('window'); };

// 定义DVA Action.
export const action = type => payload => ({ type, payload });

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

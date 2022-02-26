
export { 
    Component, 
    PureComponent 
} from 'react';

export { 
    StyleSheet,
    Dimensions
} from 'react-native';

export {
    connect,
    Provider
} from 'react-redux';

export { 
    create as dva_create 
} from 'dva-core';

import { Dimensions } from 'react-native';

// 屏幕特性
export const getWindowSize = () => { return Dimensions.get('window'); }

// 定义DVA Action.
export const action = type => payload => ({ type, payload })

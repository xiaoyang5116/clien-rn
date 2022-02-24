
export { 
    Component, 
    PureComponent 
} from 'react';

export { 
    View, 
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
export const { screenWidth, screenHeight, screenScale, fontScale } = Dimensions.get('window');

// 定义DVA Action.
export const createAction = type => payload => ({ type, payload })

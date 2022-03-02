
export { 
    Component, 
    PureComponent 
} from 'react';

export { 
    StyleSheet,
    Dimensions,
    ScrollView
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
export const getWindowSize = () => { return Dimensions.get('window'); };

// 定义DVA Action.
export const action = type => payload => ({ type, payload });

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
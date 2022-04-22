// ===============================
// DVA/原生事件相关常量和方法
// ===============================
import { 
    DeviceEventEmitter, 
} from 'react-native';

// 定义DVA Action.
export const action = type => payload => ({ type, payload });

// 定义延时方法
export const delay = time => new Promise(resolve => setTimeout(resolve, time));

// App全局事件派遣入口
export function AppDispath(params) {
    DeviceEventEmitter.emit('App.dispatch', params);
}

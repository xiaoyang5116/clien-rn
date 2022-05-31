// ===============================
// 其他常量和方法
// ===============================
import { 
    Dimensions, 
    NativeModules, 
    StatusBar,
} from 'react-native';

// 是否调试模式
export const DEBUG_MODE = true;

// 输出调试信息
export const debugMessage = (s, ...args) => { if (DEBUG_MODE) console.debug('' + ((typeof (s) == 'string') ? s.format(args) : s)); };

// 输出错误信息
export const errorMessage = (s, ...args) => { if (DEBUG_MODE) console.error('' + ((typeof (s) == 'string') ? '' + s.format(args) : s)); };

// 屏幕特性
export const getWindowSize = () => { return Dimensions.get('window'); };

// 获取状态栏高度
const { StatusBarManager } = NativeModules;
export const statusBarHeight = (Platform.OS == "ios") ? StatusBarManager.HEIGHT : StatusBar.currentHeight;
// ===============================
// 主题相关常用和方法
// ===============================
import React from 'react';
import * as Themes from '../themes';

// 风格上下文
export const ThemeContext = React.createContext();

// 获取当前风格
export const currentTheme = (defaultTheme = Themes.default.themes[0]) => { 
    const theme = Themes.default.themes.find(e => e.id == Themes.default.themeId);
    return (theme != undefined) ? theme : defaultTheme;
}

// 获取指定风格
export const getTheme = (themeId) => { return Themes.default.themes.find(e => e.id == themeId); }

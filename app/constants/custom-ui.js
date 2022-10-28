import React from 'react';
import { ThemeContext } from '.';

import CButton from '../components/CButton';

// 按钮组件
export * from '../components/button';

// header 组件
export * from '../components/header'

/** 选项按钮 */
export const TabButton = (props) => {
    const themeStyle = React.useContext(ThemeContext);
    return (
        <CButton
            title={props.title}
            fontSize={16}
            color={themeStyle.button.backgroundColor}
            fontColor={themeStyle.button.color}
            {...props}
            onPress={props.onPress}
        />
    );
}

/** 文字按钮 */
export const TextButton = (props) => {
    const themeStyle = React.useContext(ThemeContext);
    return (
        <CButton
            fontSize={18}
            color={themeStyle.button.backgroundColor}
            fontColor={themeStyle.button.color}
            {...props}
            onPress={props.onPress}
        />
    );
}

/** 图片按钮 */
export const ImageButton = (props) => {
    if (props.source == undefined || props.selectedSource == undefined)
        throw '请指定图片按钮的source & selectedSource属性';
    return (
        <CButton {...props} onPress={props.onPress} />
    );
}

/** UI常量 */
export const ARTICLE_FLATLIST_MARGIN_TOP = 35;
export const ARTICLE_EVENT_AREA_MARGIN = 35;
import React from 'react';
import { ThemeContext } from '.';

import Header from '../components/header'
import { CButton } from '../components/CButton';

/** 选项按钮 */
export const TabButton = (props) => {
    return (
        <CButton title={props.title} fontSize={16} color='#ccc' onPress={props.onPress} style={{ borderWidth: 1, borderColor: '#797979' }} />
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

/** 标题 header */
export const TitleHeader = (props) => {
    return <Header {...props} />;
}

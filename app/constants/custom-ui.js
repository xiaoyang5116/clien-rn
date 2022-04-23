import React, { useContext } from 'react';
import { ThemeContext } from '.';
import { CButton } from '../components/CButton';
import Header from '../components/header'

/** 选项按钮 */
export const TabButton = (props) => {
    return (
        <CButton title={props.title} fontSize={16} color='#c0c0c0' fontColor='#000' onPress={props.onPress} style={{ borderWidth: 1, borderColor: '#797979' }} />
    );
}

/** 文字按钮 */
export const TextButton = (props) => {
    const themeStyle = useContext(ThemeContext);
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


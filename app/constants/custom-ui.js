import React from 'react';

import { CButton } from '../components/CButton';
// import { CButton } from './custom-ui';

/** 选项按钮 */
export const TabButton = (props) => {
    return (
        <CButton title={props.title} fontSize={16} color='#c0c0c0' fontColor='#000' onPress={props.onPress} style={{ borderWidth: 1, borderColor: '#797979' }} />
    );
}

/** 文字按钮 */
export const TextButton = (props) => {
    const { currentStyles } = props;
    const customProps = (currentStyles != undefined) 
        ? { color: currentStyles.button.backgroundColor, fontColor: currentStyles.button.color } 
        : {};
    
    return (
        <CButton title={props.title} fontSize={18} {...customProps} onPress={props.onPress} />
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

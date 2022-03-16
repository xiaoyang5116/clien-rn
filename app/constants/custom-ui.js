import React from 'react';

export { CButton } from '../components/CButton';

import { CButton } from './custom-ui';

/** 标签选项按钮 */
export const TabButton = (props) => {
    return (
        <CButton title={props.title} fontSize={16} color='#c0c0c0' fontColor='#000' onPress={props.onPress} style={{ borderWidth: 1, borderColor: '#797979' }} />
    );
}

/** 普通点击按钮 */
export const NormalButton = (props) => {
    const { currentStyles } = props;
    return (
        <CButton title={props.title} fontSize={18} color={currentStyles.button.backgroundColor} fontColor={currentStyles.button.color} onPress={props.onPress} />
    );
}

import { View, Text, Image, Platform } from 'react-native';
import React from 'react';

import { ThemeContext, statusBarHeight } from '../../constants';
import { isPad } from '../../constants/resolution';

export const Header1 = props => {
    const { title, style, marginTop } = props;

    const theme = React.useContext(ThemeContext);

    const defaultMarginTop = Platform.OS == 'ios' ? statusBarHeight + 10 : 30

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: defaultMarginTop,
                ...style,
            }}
        >
            <Image
                style={{ ...theme.headerBg_size, position: 'absolute', transform: [{ scaleY: (isPad() ? 0.76 : 1) }] }}
                source={theme.headerBg}
            />
            <Text style={{ fontSize: 24, color: theme.button.color }}>{title}</Text>
        </View>
    );
};

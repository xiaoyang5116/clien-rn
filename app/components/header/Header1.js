import { View, Text, Image, Platform } from 'react-native'
import React from 'react'

import { ThemeContext, statusBarHeight } from "../../constants";


export const Header1 = (props) => {

    const { title, style } = props

    const theme = React.useContext(ThemeContext);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: (Platform.OS == 'ios' ? statusBarHeight + 10 : 30), ...style }}>
            <Image
                style={{ ...theme.headerBg_size, position: "absolute" }}
                source={theme.headerBg}
            />
            <Text style={{ fontSize: 24, color: theme.button.color }}>
                {title}
            </Text>
        </View>
    )
}

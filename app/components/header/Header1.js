import { View, Text, Image } from 'react-native'
import React from 'react'

import { ThemeContext } from "../../constants";

export const Header1 = (props) => {

    const { title, style } = props

    const theme = React.useContext(ThemeContext);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
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

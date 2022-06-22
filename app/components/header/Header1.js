import { View, Text, Image } from 'react-native'
import React from 'react'

import { ThemeContext } from "../../constants";

export const Header1 = (props) => {

    const { title, style } = props

    const theme = React.useContext(ThemeContext);

    return (
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', ...style }}>
            <Image
                style={{ width: "100%", height: "100%", position: "absolute" }}
                source={theme.headerBg}
            />
            <Text style={{ fontSize: 24 }}>
                {title}
            </Text>
        </View>
    )
}

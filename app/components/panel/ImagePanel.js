import { View, Text, ImageBackground, Image, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'

import { ThemeContext } from "../../constants";


export const ImagePanel = (props) => {
    const theme = React.useContext(ThemeContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={props.source}
                    style={{ width: "100%", height: "100%" }}
                    children={props.children}
                />
            </View>
        </SafeAreaView>
    )
}

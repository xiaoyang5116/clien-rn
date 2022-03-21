import React from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    useWindowDimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar
} from 'react-native';
import { getWindowSize } from "../../constants";
import { RenderHTML } from 'react-native-render-html';



export default function TextTemplate(props) {
    const { width } = useWindowDimensions()
    const mixedStyles = {
        // whiteSpace: 'normal',
        fontSize: 24,
    }
    return (
        <View>
            <RenderHTML
                contentWidth={width}
                source={{ html: props.data }}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={{
                    p: {
                        ...mixedStyles
                    },
                }}
            />
        </View>
    )
}

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
import { RenderHTML } from 'react-native-render-html';



export default function TextTemplate(props) {
    if (props.content === "") {
        return null
    }
    const { width } = useWindowDimensions()
    const mixedStyles = {
        // whiteSpace: 'normal',
        fontSize: 24,
    }

    const HTML_TPL = `
    <div>
    <pre>
    {CONTENT}
    </pre>
    </div>
    `;
    let html = HTML_TPL.replace("{CONTENT}", props.content);

    return (
        <View>
            <RenderHTML
                contentWidth={width}
                source={{ html: html }}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={{
                    div: {
                        ...mixedStyles
                    },
                }}
            />
        </View>
    )
}

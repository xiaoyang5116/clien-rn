import React from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    getWindowSize,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar
} from 'react-native';

export default function PopUp(props) {

    // console.log("props", props.isShow);
    if (props.isShow) {
        return (
            <View>
                <Text>popUp</Text>
            </View>
        )

    }
    return null
}

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


const data = {
    key: "序章",
    title: '序章',
    data: '穿越做乞丐',
    backgroundColor: "#E3EDCD",
    titleFontSize: 24,
    contentFontSize: 20,
    color: "black",
}

export default function Template1(props) {
    return (
        <View style={[props.currentStyles.prologueContainer, { height: Dimensions.get('window').height }]}>
            <View style={[props.currentStyles.prologueWrap, {
                color: data.color,
                backgroundColor: data.backgroundColor,
            }]}>
                <Text style={{
                    fontSize: data.titleFontSize,
                }}>
                    {props.title}
                </Text>
                <Text style={{
                    fontSize: data.titleFontSize,
                }}>
                    {props.data}
                </Text>
            </View>
            {/* <Button title='下一页' onPress={props.onAsideNext} /> */}
        </View >
    )
}

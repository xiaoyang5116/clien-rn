import Item from '@ant-design/react-native/lib/list/ListItem';
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


export default function OptionTemplate(props) {
    return (
        <Button title={props.title} onPress={() => { console.log("sss"); }} />
    )
}

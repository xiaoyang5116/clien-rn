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
    if (props.data.length > 0) {
        return (
            <View>
                {
                    props.data.map((item, index) => {
                        return <Button key={index} title={item} onPress={()=>{console.log("sss");}} />
                    })
                }
            </View>
        )
    }

    return (
        <View>
            {/* <Button title='' /> */}
        </View>
    )
}

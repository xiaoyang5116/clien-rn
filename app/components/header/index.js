import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import {
    connect,
    ThemeContext,
} from "../../constants";
import ImageCapInset from 'react-native-image-capinsets-next';

const Header = (props) => {
    const theme = useContext(ThemeContext);
    const height = props.height ? props.height : 50
    const width = props.width ? props.width : "100%"
    const fontSize = props.fontSize ? props.fontSize : 24
    const source = props.source ? props.source : require('../../../assets/frame/titleFrame.png')

    return (
        <View style={[{ height: height, width: width, position: 'relative' }, theme.headerBg, ...props.style]}>
            <ImageCapInset
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                source={source}
                capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
            />
            <Text style={{ fontSize: fontSize }}>{props.title}</Text>
        </View>
    )
}

export default Header
import { View, Text, ImageBackground, Image } from 'react-native'
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
    const source = props.source ? props.source : require('../../../assets/frame/titleFrame.png')
    const cropSize = props.cropSize ? props.cropSize : 25
    const fontSize = props.fontSize ? props.fontSize : 24

    return (
        <View style={[{ height: height, width: width, position: 'relative' }, theme.headerBg, ...props.style]}>
            <ImageCapInset
                style={{ width: '100%', height: '100%', position: 'absolute' }}
                source={source}
                capInsets={{ top: cropSize, right: cropSize, bottom: cropSize, left: cropSize }}
            />
            <Text style={{ fontSize: fontSize }}>{props.title}</Text>
        </View>
    )
}

export default Header
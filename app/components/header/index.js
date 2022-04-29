import { View, Text, Image } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../constants';

const Header = props => {
    const theme = useContext(ThemeContext);
    const height = props.height ? props.height : 130;
    const width = props.width ? props.width : '100%';
    const source = props.source ? props.source : require('../../../assets/frame/titleFrame3.png')
    const fontSize = props.fontSize ? props.fontSize : 24;

    return (
        <View
            style={[
                {
                    height: height,
                    width: width,
                    position: 'relative',
                },
                ...props.style,
            ]}>
            <Image
                style={[{ position: 'absolute', width: "100%", height: "100%", zIndex: 1 }, theme.rowCenter]}
                source={source}
            />
            <View style={[{ height: 50, width: width }, theme.blockBgColor1, theme.rowCenter]}>
                <Text style={[{ fontSize: fontSize }, theme.headerTextColor,]}>
                    {props.title}
                </Text>
            </View>
        </View>
    );
};

export default Header;

import { View, Text, TouchableHighlight, Image } from 'react-native';
import React from 'react';

import PropTypes from 'prop-types';

import { ThemeContext } from '../../constants';
import { px2pd } from '../../constants/resolution';

export const LongTextButton = props => {
    const { title, onPress, source, borderColor, color, fontSize } = props;

    const theme = React.useContext(ThemeContext);

    const onPressHandler = () => {
        if (onPress != undefined) {
            props.onPress();
        }
    };

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}>
            <TouchableHighlight
                underlayColor={'#fff'}
                activeOpacity={0.4}
                style={{
                    width: px2pd(1016),
                    height: px2pd(102),
                    borderWidth: px2pd(3),
                    borderRadius: 3,
                    borderColor: borderColor ? borderColor : "#404040",
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    zIndex: 1,
                }}
                onPress={onPressHandler}
            >
                <Image
                    style={{ width: px2pd(1010), height: px2pd(96) }}
                    source={source ? source : theme.LongTBBgImage}
                />
            </TouchableHighlight>
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    zIndex: 2
                }}>
                <Image
                    style={{
                        width: px2pd(1010),
                        height: px2pd(96),
                    }}
                    source={theme.LongTBBorderImage}
                />
            </View>

            <View pointerEvents="none" style={{ position: 'absolute', zIndex: 3 }}>
                <Text
                    style={{
                        fontSize: fontSize ? fontSize : 18,
                        color: color ? color : theme.button.color,
                    }}>
                    {title}
                </Text>
            </View>
        </View>
    );
};

LongTextButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    source: PropTypes.number,
    borderColor: PropTypes.string,
    color: PropTypes.string,
    fontSize: PropTypes.number
}

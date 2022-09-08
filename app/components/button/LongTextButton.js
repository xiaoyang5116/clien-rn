import { View, Text, TouchableHighlight, Image, StyleSheet } from 'react-native';
import React from 'react';

import PropTypes from 'prop-types';

import { ThemeContext } from '../../constants';
import { isPad, px2pd } from '../../constants/resolution';
import FastImage from 'react-native-fast-image';

export const LongTextButton = props => {
    const { title, onPress, fontSize } = props;

    const theme = React.useContext(ThemeContext);

    const onPressHandler = () => {
        if (onPress != undefined) {
            props.onPress();
        }
    };

    return (
        <View style={styles.center}>
            <TouchableHighlight
                underlayColor={'#fff'}
                activeOpacity={0.4}
                disabled={props.disabled ? props.disabled : false}
                style={[
                    styles.center,
                    styles.btnContainer,
                    { borderColor: '#404040' },
                ]}
                onPress={onPressHandler}
            >
                <FastImage
                    style={styles.imageContainer}
                    source={theme.LongTBBgImage}
                />
            </TouchableHighlight>
            <View pointerEvents="none" style={styles.patternContainer}>
                <FastImage style={styles.imageContainer} resizeMode={'stretch'} source={theme.LongTBBorderImage} />
            </View>
            <View pointerEvents="none" style={styles.textContainer}>
                <Text style={{
                    fontSize: fontSize,
                    color: theme.button.color,
                }}>
                    {title}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    btnContainer: {
        width: px2pd(1013),
        height: px2pd(102) * (isPad() ? 0.76 : 1),
        borderWidth: px2pd(3),
        borderRadius: 3,
        zIndex: 1,
    },
    imageContainer: {
        width: px2pd(1010),
        height: px2pd(96) * (isPad() ? 0.76 : 1),
    },
    patternContainer: {
        position: 'absolute',
        zIndex: 2,
    },
    textContainer: {
        position: 'absolute',
        zIndex: 3,
    },
});

LongTextButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    fontSize: PropTypes.number,
};

LongTextButton.defaultProps = {
    fontSize: 18
}

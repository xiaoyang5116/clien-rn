import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import { Animated, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import { useImperativeHandle } from 'react';

const NotificationIcon = (props, ref) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const [display, setDisplay] = React.useState('none');

    const animation = React.useRef(
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.3,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1.0,
                    duration: 600,
                    useNativeDriver: true,
                })
            ])
        )
    ).current;

    React.useEffect(() => {
        animation.start();
        return () => {
            animation.stop();
        }
    }, []);

    useImperativeHandle(ref, () => ({
        active: () => {
            setDisplay('flex');
        }
    }));

    const pressHandler = () => {
        if (props.onPress != undefined) {
            props.onPress();
        }
        setDisplay('none');
    }

    return (
        <TouchableWithoutFeedback onPress={pressHandler}>
            <Animated.View style={{ transform: [{ scale: scale }], display: display }}>
                <FastImage style={{ width: px2pd(50), height: px2pd(50) }} source={require('../../../assets/button_icon/103.png')} />
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default forwardRef(NotificationIcon);

NotificationIcon.propTypes = {
    onPress: PropTypes.func,
}

NotificationIcon.defaultProps = {
}

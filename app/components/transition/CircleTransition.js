import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const CircleTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
            })
        ]).start((r) => {
            const { finished } = r;
            if (finished) {
                setPointerEvents('none');
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {props.children}
            </Animated.View>
            <Animated.View style={[styles.maskContainer, { opacity: opacity }]} pointerEvents={pointerEvents}>
                <FastImage style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../../assets/bg/circle_trans_black.png')} />
            </Animated.View>
        </View>
    )
}

export default CircleTransition;

const styles = StyleSheet.create({
    maskContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row'
    },
});

CircleTransition.propTypes = {
    color: PropTypes.string,
};

CircleTransition.defaultProps = {
    color: '#fff',
};
import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const BlackCircleTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const fadeOutOpacity = React.useRef(new Animated.Value(0)).current;
    const fadeInOpacity = React.useRef(new Animated.Value(0)).current;
    const bodyOpacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeInOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(fadeInOpacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(fadeOutOpacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(bodyOpacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(fadeOutOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
            }),
        ]).start((r) => {
            const { finished } = r;
            if (finished) {
                setPointerEvents('none');
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={[styles.bodyContainer, { opacity: bodyOpacity }]}>
                {props.children}
            </Animated.View>
            <Animated.View style={[styles.fadeOutContainer, { opacity: fadeOutOpacity }]} pointerEvents={pointerEvents}>
                <FastImage style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../../assets/bg/circle_trans_black.png')} />
            </Animated.View>
            <Animated.View style={[styles.fadeInContainer, { opacity: fadeInOpacity } ]} pointerEvents={pointerEvents} />
        </View>
    )
}

export default BlackCircleTransition;

const styles = StyleSheet.create({
    fadeOutContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row'
    },
    fadeInContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#000'
    },
    bodyContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%'
    }
});

BlackCircleTransition.propTypes = {
    color: PropTypes.string,
};

BlackCircleTransition.defaultProps = {
    color: '#fff',
};
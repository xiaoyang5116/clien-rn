import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';
import { px2pd } from '../../constants/resolution';

import { 
    Animated, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const OpenYTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const fadeOutOpacity = React.useRef(new Animated.Value(0)).current;
    const fadeInOpacity = React.useRef(new Animated.Value(0)).current;
    const bodyOpacity = React.useRef(new Animated.Value(0)).current;
    const translateYTop = React.useRef(new Animated.Value(0)).current;
    const translateYBottom = React.useRef(new Animated.Value(0)).current;

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
            // 上下拉且降低透明度
            Animated.parallel([
                Animated.timing(translateYTop, {
                    toValue: -px2pd(1700),
                    duration: 600,
                    useNativeDriver: false,
                }),
                Animated.timing(translateYBottom, {
                    toValue: px2pd(1700),
                    duration: 600,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeOutOpacity, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: false,
                }),
            ])
        ]).start((r) => {
            const { finished } = r;
            if (finished) {
                setPointerEvents('none');
                if (props.onCompleted != undefined) {
                    props.onCompleted();
                }
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={[styles.bodyContainer, { opacity: bodyOpacity }]}>
                {props.children}
            </Animated.View>
            <Animated.View style={[styles.fadeOutContainer, { opacity: fadeOutOpacity }]} pointerEvents={pointerEvents}>
                <Animated.View style={{ position: 'absolute', width: px2pd(1080), height: px2pd(1680), top: 0, transform: [{ translateY: translateYTop }] }}>
                    <FastImage style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../../assets/bg/open_trans_y.png')} />
                </Animated.View>
                <Animated.View style={{ position: 'absolute', width: px2pd(1080), height: px2pd(1680), bottom: 0, transform: [{ translateY: translateYBottom }] }}>
                    <FastImage style={{ width: '100%', height: '100%', transform: [{ rotate: '-180deg' }] }} resizeMode={'stretch'} source={require('../../../assets/bg/open_trans_y.png')} />
                </Animated.View>
            </Animated.View>
            <Animated.View style={[styles.fadeInContainer, { opacity: fadeInOpacity } ]} pointerEvents={pointerEvents} />
        </View>
    )
}

export default OpenYTransition;

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
        backgroundColor: '#fff'
    },
    bodyContainer: {
        position: 'absolute', 
        width: '100%', 
        height: '100%'
    }
});

OpenYTransition.propTypes = {
    color: PropTypes.string,
    onCompleted: PropTypes.func,
};

OpenYTransition.defaultProps = {
    color: '#fff',
};
import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const OpenXTransition = (props) => {

    const [display, setDisplay] = React.useState('none');
    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const width = React.useRef(new Animated.Value(px2pd(1))).current;
    const opacity = React.useRef(new Animated.Value(0.5)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(width, {
                toValue: px2pd(1080),
                duration: 2000,
                useNativeDriver: false,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            })
        ]).start((r) => {
            const { finished } = r;
            if (finished) {
                setDisplay('flex');
                setPointerEvents('none');

                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: false,
                }).start();
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', display: display }}>
                {props.children}
            </Animated.View>
            <Animated.View style={[styles.maskContainer, { opacity: opacity }]} pointerEvents={pointerEvents}>
                <View style={{ width: px2pd(540), height: '100%' }}>
                    <FastImage style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../../assets/bg/open_trans_left.png')} />
                </View>
                <Animated.View style={{ width: width, height: '100%', backgroundColor: '#fff' }} />
                <View style={{ width: px2pd(540), height: '100%' }}>
                    <FastImage style={{ width: '100%', height: '100%' }} resizeMode={'stretch'} source={require('../../../assets/bg/open_trans_right.png')} />
                </View>
            </Animated.View>
        </View>
    )
}

export default OpenXTransition;

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

OpenXTransition.propTypes = {
    color: PropTypes.string,
};

OpenXTransition.defaultProps = {
    color: '#fff',
};
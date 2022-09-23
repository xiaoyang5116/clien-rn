import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated,
} from 'react-native';

import lo from 'lodash';
import { BlurView } from '@react-native-community/blur';

import XuanWoAnimation from '../../components/effects/XuanWoAnimation';

const AnimatedBlurView = (props) => {

    const uniqueKey = React.useRef(0);
    const [blur, setBlur] = React.useState(1);

    React.useEffect(() => {
        let prev = 0;
        const key = props.value.addListener(({ value }) => {
            const intValue = Math.ceil(value);
            if (intValue > prev) {
                setBlur(intValue);
                prev = intValue;
            }
        });
        return () => {
            props.value.removeListener(key);
        }
    }, []);

    uniqueKey.current += 1;

    return (
    <BlurView
        style = {{ position: 'absolute', width: '100%', height: '100%' }}
        key={uniqueKey.current}
        blurType = "light"
        blurAmount = {blur}
        reducedTransparencyFallbackColor="white" />
    );
}

const XuanWoTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('none');

    const blur = React.useRef(new Animated.Value(1)).current;
    const fadeInOpacity = React.useRef(new Animated.Value(0)).current;
    const fadeOutOpacity = React.useRef(new Animated.Value(0)).current;
    const bodyOpacity = React.useRef(new Animated.Value(0)).current;

    const xwScale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(xwScale, {
                    toValue: 3,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(600),
                    Animated.timing(fadeInOpacity, {
                        toValue: 1,
                        duration: 0,
                        useNativeDriver: false
                    }),
                    Animated.parallel([
                        Animated.timing(blur, {
                            toValue: 50,
                            duration: 1500,
                            useNativeDriver: false
                        }),
                        Animated.timing(fadeOutOpacity, {
                            toValue: 1,
                            duration: 1600,
                            useNativeDriver: false
                        }),
                    ]),
                ]),
            ]),
            Animated.timing(fadeInOpacity, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false
            }),
            Animated.timing(bodyOpacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false
            }),
            Animated.timing(fadeOutOpacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false
            }),
        ]).start(({ finished }) => {
            if (finished) {
                setPointerEvents('auto');
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={{ transform: [{ scale: xwScale }] }}>
                <XuanWoAnimation />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', opacity: fadeInOpacity }}>
                <AnimatedBlurView value={blur} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', opacity: bodyOpacity }} pointerEvents={pointerEvents}>
                {props.children}
            </Animated.View>
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff', opacity: fadeOutOpacity }} pointerEvents={'none'} />
        </View>
    )
}

export default XuanWoTransition;

XuanWoTransition.propTypes = {
};

XuanWoTransition.defaultProps = {
};
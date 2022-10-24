import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    Animated,
    View,
    StyleSheet,
    Text,
    Easing,
} from 'react-native';

import {
    getWindowSize,
} from '../../constants'

import Transitions from '../../components/transition';
import RootView from '../../components/RootView';
import { px2pd } from '../../constants/resolution';

const WINSIZE = getWindowSize();
const FONT_ANIMATION_DURATION = 1200;

const LeftWorldNameLayer = (props) => {

    const translateX = React.useRef(new Animated.Value(-WINSIZE.width)).current;

    const onLayout = ({ nativeEvent }) => {
        const { width } = nativeEvent.layout;
        translateX.setValue(-width);

        Animated.timing(translateX, {
            toValue: px2pd(120),
            duration: FONT_ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start()
    }

    return (
        <Animated.View style={{ position: 'absolute', left: 0, transform: [{ translateX: translateX }] }} onLayout={onLayout}>
            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{props.worldName}</Text>
        </Animated.View>
    );
}

const RightWordOfYearLayer = (props) => {
    const translateX = React.useRef(new Animated.Value(WINSIZE.width)).current;

    const onLayout = ({ nativeEvent }) => {
        const { width } = nativeEvent.layout;
        translateX.setValue(width);

        Animated.timing(translateX, {
            toValue: (-WINSIZE.width / 2) + px2pd(120),
            duration: FONT_ANIMATION_DURATION,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start()
    }

    return (
        <Animated.View style={{ position: 'absolute', right: 0, transform: [{ translateX: translateX }] }} onLayout={onLayout}>
            <Text style={{ marginTop: px2pd(400), fontSize: 40, fontWeight: 'bold' }}>{props.year}</Text>
        </Animated.View>
    )
}

const LinerLayer = (props) => {

    const width = React.useRef(new Animated.Value(WINSIZE.width / 2)).current;

    React.useEffect(() => {
        Animated.timing(width, {
            toValue: WINSIZE.width - (px2pd(120) * 2),
            duration: FONT_ANIMATION_DURATION,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={{ position: 'absolute', left: px2pd(120) }}>
            <Animated.View style={{ marginTop: px2pd(210), borderRadius: 3, width: width, height: 2, backgroundColor: '#666' }}>
            </Animated.View>
        </Animated.View>
    )
}

const WorldSwitchAnimation = (props) => {

    const opacity = React.useRef(new Animated.Value(1)).current;

    const onCloseHandler = () => {
        if (props.onClose != undefined) {
            props.onClose();
        }
    }

    const trans = () => {
        onCloseHandler();
        const key = RootView.add(<Transitions transitionName={'白色转场带背景'} onCompleted={() => {
            RootView.remove(key);
        }} />);
    }

    React.useEffect(() => {
        const animation = Animated.sequence([
            Animated.delay(FONT_ANIMATION_DURATION),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
            }),
            {
                start: cb => {
                    trans();
                    cb({ finished: true });
                },
                stop: () => {
                },
            }
        ]);
        animation.start();
        return () => {
            animation.stop();
        }
    }, []);

    return (
        <View style={styles.viewContainer} onTouchEnd={onCloseHandler}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
                <Animated.View style={{ position: 'absolute', top: px2pd(260), opacity: opacity, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <LeftWorldNameLayer worldName={props.worldName} />
                    <LinerLayer />
                    <RightWordOfYearLayer year={props.year} />
                </Animated.View>
            </View>
        </View>
    );
}

WorldSwitchAnimation.propTypes = {
    onClose: PropTypes.func,
    worldName: PropTypes.string,
    year: PropTypes.string,
}

WorldSwitchAnimation.defaultProps = {
    worldName: '现实世界',
    year: 'AD2028年',
}

export default WorldSwitchAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

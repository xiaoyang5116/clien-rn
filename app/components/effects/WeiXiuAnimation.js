import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    View,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';

import NumberString from '../extends/NumberString';
import { px2pd } from '../../constants/resolution';
import FastImage from 'react-native-fast-image';

const BASE_X = 0;
const BASE_Y = 0;
const LINE_HEIGHT = px2pd(150);

const PREDEFINE_POS = [
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * -3) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * -2) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * -1) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 3) },

    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * -3) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * -2) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * -1) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X - 120, y: BASE_Y + (LINE_HEIGHT * 3) },

    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * -3) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * -2) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * -1) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X + 120, y: BASE_Y + (LINE_HEIGHT * 3) },
];

const NumberLayer = (props) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateXY = React.useRef(new Animated.ValueXY(props.pos)).current;

    React.useEffect(() => {
        const animation = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(translateXY, {
                toValue: { x: (props.pos.x + (props.randX ? lo.random(-10, 10) : 0)), y: props.pos.y - 20 },
                duration: 1000,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]);
        animation.start(({ finished }) => {
            if (finished) {
                if (props.onEnd != undefined) {
                    props.onEnd();
                }
            }
        });

        return () => {
            animation.stop();
        }
    }, []);

    return (
        <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} pointerEvents='none'>
            <Animated.View style={[styles.numberLayerContainer, { opacity: opacity, transform: [{ translateX: translateXY.x }, { translateY: translateXY.y }] }]}>
                <FastImage source={require('../../../assets/bg/xiuwei_label.png')} style={{ width: px2pd(109), height: px2pd(53) }} />
                <FastImage source={require('../../../assets/bg/plus.png')} style={{ width: px2pd(34), height: px2pd(36) }} />
                <NumberString value={props.value} />
            </Animated.View>
        </View>
    );
}

NumberLayer.propTypes = {
    value: PropTypes.string,
    pos: PropTypes.object,
    randX: PropTypes.bool,
    onEnd: PropTypes.func,
}

NumberLayer.defaultProps = {
    value: '666',
    randX: true,
}

const WeiXiuAnimation = (props) => {

    const uniqueKey = React.useRef(0);
    const pendingList = React.useRef([...props.values]);
    const predefinePos = React.useRef(lo.cloneDeep(PREDEFINE_POS));
    const animationQueue = React.useRef([]);
    const [layers, setLayers] = React.useState([]);

    const animationOnEnd = (key, posIndex) => {
        const index = lo.indexOf(animationQueue.current, key);
        if (index != -1) {
            animationQueue.current.splice(index, 1);
        }
        predefinePos.current[posIndex].__used = false;

        if (animationQueue.current.length == 0 && pendingList.current.length == 0) {
            if (props.onClose != undefined) {
                props.onClose();
            }
        }
    }

    React.useEffect(() => {
        const timer = setInterval(() => {
            const value = pendingList.current.shift();
            if (value == undefined)
                return;

            const validList = lo.filter(predefinePos.current, (v) => { return (v.__used == undefined || !v.__used); });
            if (validList.length <= 0) return;

            // 一个元素时固定为中间往上
            const onlyOne = (props.values.length == 1);
            const randIndex = onlyOne ? 3 : lo.random(validList.length - 1);
            const pos = validList[randIndex];
            const posIndex = lo.findIndex(predefinePos.current, (v) => (v.x == pos.x && v.y == pos.y));

            setLayers((layers) => {
                const key = uniqueKey.current;
                const layer = (<NumberLayer key={key} value={value} pos={pos} randX={!onlyOne} onEnd={() => animationOnEnd(key, posIndex)} />);
                animationQueue.current.push(key);
                pos.__used = true;

                const newLayers = [];
                lo.forEach(layers, (v, k) => {
                    if (lo.indexOf(animationQueue.current, parseInt(v.key)) != -1) {
                        newLayers.push(v);
                    }
                });
                return [...newLayers, layer];
            });
            uniqueKey.current += 1;
        }, 100);
        return () => {
            clearInterval(timer);
        }
    }, []);

    return (
        <View style={styles.viewContainer}>
            {layers}
        </View>
    );
}

WeiXiuAnimation.propTypes = {
    values: PropTypes.array,
    onClose: PropTypes.func,
}

WeiXiuAnimation.defaultProps = {
    values: ['123', '456', '789'],
}

export default WeiXiuAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    numberLayerContainer: {
        position: 'absolute', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

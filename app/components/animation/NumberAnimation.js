import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    View,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';

import NumberString from '../../components/extends/NumberString';
import { px2pd } from '../../constants/resolution';

const BASE_X = 0;
const BASE_Y = -200;
const LINE_HEIGHT = px2pd(55);

const PREDEFINE_POS = [
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 3) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 4) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 5) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 6) },
    { x: BASE_X, y: BASE_Y + (LINE_HEIGHT * 7) },

    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 3) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 4) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 5) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 6) },
    { x: BASE_X - 100, y: BASE_Y + (LINE_HEIGHT * 7) },

    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 0) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 1) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 2) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 3) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 4) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 5) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 6) },
    { x: BASE_X + 100, y: BASE_Y + (LINE_HEIGHT * 7) },
];

let animationQueue = [];
let lastIndex = 0;

const NumberLayer = (props) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateXY = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    React.useEffect(() => {
        const pos = props.pos;
        translateXY.x.setValue(pos.x);

        const animation = Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(translateXY, {
                toValue: pos,
                duration: 1800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
        ]);

        animationQueue.push(pos);
        animation.start(({ finished }) => {
            if (finished) {
                const index = lo.findIndex(animationQueue, (v) => (v.x == pos.x && v.y == pos.y));
                if (index != -1) {
                    animationQueue.splice(index, 1);
                }
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
            <Animated.View style={{ position: 'absolute', opacity: opacity, transform: [{ translateX: translateXY.x }, { translateY: translateXY.y }] }}>
                <NumberString value={props.value} />
            </Animated.View>
        </View>
    );
}

NumberLayer.propTypes = {
    value: PropTypes.string,
    pos: PropTypes.object,
    onEnd: PropTypes.func,
}

NumberLayer.defaultProps = {
    value: '666',
}

const NumberAnimation = (props) => {

    // const pos = PREDEFINE_POS[lastIndex];
    // if ((lastIndex + 1) >= PREDEFINE_POS.length) {
    //     lastIndex = 0;
    // } else {
    //     lastIndex++;
    // }
    
    // translateXY.x.setValue(pos.x);

    return (
        <View style={styles.viewContainer}>
            <NumberLayer value={'123'} pos={PREDEFINE_POS[0]} />
            <NumberLayer value={'123'} pos={PREDEFINE_POS[1]} />
            <NumberLayer value={'456'} pos={PREDEFINE_POS[2]} />
            <NumberLayer value={'456'} pos={PREDEFINE_POS[3]} />
            <NumberLayer value={'789'} pos={PREDEFINE_POS[4]} />
            <NumberLayer value={'789'} pos={PREDEFINE_POS[5]} />
            <NumberLayer value={'123'} pos={PREDEFINE_POS[6]} />
        </View>
    );
}

export default NumberAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

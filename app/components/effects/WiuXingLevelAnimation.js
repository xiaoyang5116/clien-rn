import React from 'react';
import PropTypes from 'prop-types';
import lo from 'lodash';

import {
    Animated,
    View,
    StyleSheet,
} from 'react-native';
import { px2pd } from '../../constants/resolution';

const PERIOD_SEQUEUE = ['锻体', '先天', '练气', '筑基', '金丹'];

const Word = (props) => {
    const index = lo.indexOf(PERIOD_SEQUEUE, props.period);

    const modX = (props.level % 3);
    const offsetX = (modX == 0) ? 3 : modX;

    const translateX = (offsetX - 1) * px2pd(600);
    const translateY = (index * (3 * px2pd(120))) + ((Math.ceil(props.level / 3) - 1) * px2pd(120));

    return (
        <View style={{ width: px2pd(600), height: px2pd(120), overflow: 'hidden' }}>
            <Animated.Image 
                source={require('../../../assets/animations/xiuxing_level.png')} 
                style={{ width: px2pd(1800), height: px2pd(1800), transform: [{ translateX: -translateX }, { translateY: -translateY }] }} 
            />
        </View>
    )
}

Word.propTypes = {
    period: PropTypes.string, // 阶段
    level: PropTypes.number, // 等级
}

Word.defaultProps = {
    period: '锻体',
    level: 1,
}

const WiuXingLevelAnimation = (props) => {

    const translateY = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -160,
                duration: 1600,
                useNativeDriver: false,
            }),
            Animated.sequence([
                Animated.delay(1000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: false
                })
            ])
        ]).start(({ finished }) => {
            if (finished) {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }
        })
    }, []);

    return (
        <View style={styles.viewContainer}>
            <Animated.View style={{ opacity: opacity, transform: [{ translateY: translateY }, { scale: 1.5 }] }}>
                <Word period={props.period} level={props.level} />
            </Animated.View>
        </View>
    );
}

WiuXingLevelAnimation.propTypes = {
    period: PropTypes.string, // 阶段
    level: PropTypes.number, // 等级
    onClose: PropTypes.func,
}

WiuXingLevelAnimation.defaultProps = {
    period: '锻体',
    level: 1,
}

export default WiuXingLevelAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

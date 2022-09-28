import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { px2pd } from '../../constants/resolution';

const LINE_HEIGHT = px2pd(80);

const CountDown = (props) => {

    const textTop = React.useRef(props.sequeue[1]);
    const textMiddle = React.useRef(props.sequeue[0]);
    const translateYTop = React.useRef(new Animated.Value(0)).current;
    const translateYMiddle = React.useRef(new Animated.Value(0)).current;
    const opacityTop = React.useRef(new Animated.Value(0)).current;
    const opacityMiddle = React.useRef(new Animated.Value(1)).current;
    const [textViews, setTextViews] = React.useState([]);

    const transition = (opacityTop, translateYTop, opacityMiddle, translateYMiddle) => {
        opacityTop.setValue(0);
        opacityMiddle.setValue(1);
        translateYTop.setValue(-LINE_HEIGHT);
        translateYMiddle.setValue(0);

        Animated.parallel([
            Animated.parallel([
                Animated.timing(opacityTop, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(translateYTop, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                })
            ]),
            Animated.parallel([
                Animated.timing(opacityMiddle, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(translateYMiddle, {
                    toValue: LINE_HEIGHT,
                    duration: 300,
                    useNativeDriver: false
                })
            ])
        ]).start(({ finished }) => {
            if (finished) {
                if (props.onCompleted != undefined) {
                    props.onCompleted();
                }
            }
        });
    }

    const buildViews = () => {
        const views = (
            <View style={{ width: 'auto', height: LINE_HEIGHT * 3, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View key={'top'} style={{ position: 'absolute', opacity: opacityTop, transform: [{ translateY: translateYTop }] }}>
                    <Text style={styles.textStyle}>{textTop.current}</Text>
                </Animated.View>
                <Animated.View key={'middle'} style={{ position: 'absolute', opacity: opacityMiddle, transform: [{ translateY: translateYMiddle }] }}>
                    <Text style={styles.textStyle}>{textMiddle.current}</Text>
                </Animated.View>
            </View>
        );
        setTextViews(views);
    }

    React.useEffect(() => {
        // 循环播放:
        // const timer = setInterval(() => {
        //     buildViews();
        //     transition(opacityTop, translateYTop, opacityMiddle, translateYMiddle);
        //     //
        //     const tmp = textTop.current;
        //     textTop.current = textMiddle.current;
        //     textMiddle.current = tmp;
        // }, 600);
        // return () => {
        //     clearInterval(timer);
        // }

        buildViews();

        const timer = setTimeout(() => {
            transition(opacityTop, translateYTop, opacityMiddle, translateYMiddle);
        }, props.delay);
        
        return () => {
            clearTimeout(timer);
        }
    }, []);

    return (
        <View style={{}}>
            {textViews}
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: '#fff', 
        lineHeight: LINE_HEIGHT,
        fontSize: 24, 
        textShadowColor: '#000', 
        textShadowRadius: 2, 
        shadowOpacity: 0,
    },
});

CountDown.propTypes = {
    sequeue: PropTypes.array,
    delay: PropTypes.number,
    onCompleted: PropTypes.func,
}

CountDown.defaultProps = {
    delay: 0,
}

export default CountDown;
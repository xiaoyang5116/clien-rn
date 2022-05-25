import React from 'react';
import FastImage from 'react-native-fast-image';
import { random, range } from 'lodash';

import {
    Animated,
} from 'react-native';

import {
    getWindowSize,
    StyleSheet,
} from '../../constants'

import { px2pd } from '../../constants/resolution';
import Easing from 'react-native/Libraries/Animated/Easing';

const WIN_SIZE = getWindowSize();

const FLOWERS = [
    require('../../../assets/flower/H01.png'),
    require('../../../assets/flower/H02.png'),
    require('../../../assets/flower/H03.png'),
    require('../../../assets/flower/H04.png'),
    require('../../../assets/flower/H05.png'),
    require('../../../assets/flower/H06.png'),
    require('../../../assets/flower/H07.png'),
    require('../../../assets/flower/H08.png'),
    require('../../../assets/flower/H09.png'),
    require('../../../assets/flower/H10.png'),
    require('../../../assets/flower/H11.png'),
    require('../../../assets/flower/H12.png'),
    require('../../../assets/flower/H13.png'),
]

/**
 * 飘落的动画效果
 */
export default class Flower extends React.Component {
    constructor(props) {
        super(props);
        this.sprites = [];
        this.animations = [];
        this.translateX = new Animated.Value(0);

        for (let i in range(20)) {
            const randLeft = random(0, WIN_SIZE.width * 2);
            const randTop = random(-100, 100);
            const position = new Animated.ValueXY({ x: randLeft, y: randTop });
            const opacity = new Animated.Value(1);
            const spin = new Animated.Value(0);
            const sp = (
                <Animated.View key={i} style={{ position: 'absolute', left: position.x, top: position.y, opacity: opacity, 
                    transform: [{ rotate: spin.interpolate({ inputRange: [-1, 1], outputRange: ['-360deg', '360deg'] }) }]
                    }}>
                    <FastImage style={{ width: px2pd(51), height: px2pd(38) }} source={FLOWERS[random(12)]} />
                </Animated.View>
            );

            this.sprites.push(sp);
            this.animations.push({ position, opacity, spin });
        }
    }

    setTranslateX(x) {
        this.translateX.setValue(x);
    }

    componentDidMount() {
        this.animations.forEach(e => {
            const { position, opacity, spin } = e;
            const dropTime = random(20*1000, 60*1000);
            const array = [];
            // 掉落效果
            array.push(Animated.timing(position, {
                toValue: { x: random(100, WIN_SIZE.width * 3), y: WIN_SIZE.height },
                duration: dropTime,
                easing: Easing.linear,
                useNativeDriver: false,
            }));
            // 临近底部隐藏
            array.push(Animated.sequence([
                Animated.delay(dropTime * 0.45),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: dropTime * 0.3,
                    useNativeDriver: false,
                }),
            ]));
            // 随机旋转
            array.push(Animated.timing(spin, {
                toValue: random(0, 1) > 0 ? 1 : -1,
                duration: 15000,
                useNativeDriver: false,
            }));
            // 循环播放动画
            Animated.loop(Animated.parallel(array)).start();
        });
    }

    render() {
        return (
            <Animated.View style={[styles.viewContainer, { transform: [{ translateX: this.translateX }] }]} pointerEvents='none'>
                {this.sprites}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        left: 0, 
        top: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 10, 
        opacity: 0.5,
    },
});

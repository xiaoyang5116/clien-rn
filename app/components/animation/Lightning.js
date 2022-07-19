import React from 'react';
import lo from 'lodash';

import {
    View,
    StyleSheet,
    Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';


const IMAGES = [
    { id: 0, source: require('../../../assets/animations/lightning/0.png') },
    { id: 1, source: require('../../../assets/animations/lightning/1.png') },
    { id: 2, source: require('../../../assets/animations/lightning/2.png') },
    { id: 3, source: require('../../../assets/animations/lightning/3.png') },
    { id: 4, source: require('../../../assets/animations/lightning/4.png') },
    { id: 5, source: require('../../../assets/animations/lightning/5.png') },
    { id: 6, source: require('../../../assets/animations/lightning/6.png') },
    { id: 7, source: require('../../../assets/animations/lightning/7.png') },
    { id: 8, source: require('../../../assets/animations/lightning/8.png') },
    { id: 9, source: require('../../../assets/animations/lightning/9.png') },
    { id: 10, source: require('../../../assets/animations/lightning/10.png') },
    { id: 11, source: require('../../../assets/animations/lightning/11.png') },
    { id: 12, source: require('../../../assets/animations/lightning/12.png') },
    { id: 13, source: require('../../../assets/animations/lightning/13.png') },
    { id: 14, source: require('../../../assets/animations/lightning/14.png') },
    { id: 15, source: require('../../../assets/animations/lightning/15.png') },
    { id: 16, source: require('../../../assets/animations/lightning/16.png') },
    { id: 17, source: require('../../../assets/animations/lightning/17.png') },
    { id: 18, source: require('../../../assets/animations/lightning/18.png') },
    { id: 19, source: require('../../../assets/animations/lightning/19.png') },
    { id: 20, source: require('../../../assets/animations/lightning/20.png') },
    { id: 21, source: require('../../../assets/animations/lightning/21.png') },
    { id: 22, source: require('../../../assets/animations/lightning/22.png') },
    { id: 23, source: require('../../../assets/animations/lightning/23.png') },
    { id: 24, source: require('../../../assets/animations/lightning/24.png') },
    { id: 25, source: require('../../../assets/animations/lightning/25.png') },
    { id: 26, source: require('../../../assets/animations/lightning/26.png') },
    { id: 27, source: require('../../../assets/animations/lightning/27.png') },
    { id: 28, source: require('../../../assets/animations/lightning/28.png') },
    { id: 29, source: require('../../../assets/animations/lightning/29.png') },
    { id: 30, source: require('../../../assets/animations/lightning/30.png') },
]

const Lightning = (props) => {

    const rotate = lo.isNumber(props.rotate) ? props.rotate : 90;
    const opacitys = React.useRef([]);

    React.useEffect(() => {
        let index = -1;
        const timer = setInterval(() => {
            if (index >= 0) {
                opacitys.current[index].setValue(0);
            }

            index++;
            if (index >= IMAGES.length) {
                clearInterval(timer);
                if (props.onClose != undefined) {
                    props.onClose();
                }
                return;
            }

            opacitys.current[index].setValue(1);
        }, 100);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const items = [];
    opacitys.current.length = 0;

    IMAGES.forEach(e => {
        const opacity = new Animated.Value(0);
        opacitys.current.push(opacity);

        items.push(
            <Animated.View key={e.id} style={{ position: 'absolute', opacity: opacity, transform: [{ rotate: `${rotate}deg` }] }}>
                <FastImage style={{ width: 1280, height: 720 }} source={e.source} />
            </Animated.View>
        );
    });

    return (
        <View style={styles.viewContainer}>
            {items}
        </View>
    );
}

export default Lightning;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

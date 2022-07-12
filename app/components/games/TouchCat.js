import React from 'react';
import FastImage from 'react-native-fast-image';

import {
    View,
    Text,
    Animated,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    StyleSheet,
} from '../../constants'

import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PREGRESS_BAR_WIDTH = px2pd(680);

const IMAGES = [
    { source: require('../../../assets/games/cat/1.png') },
    { source: require('../../../assets/games/cat/2.png') },
]

const ProgressBar = (props) => {

    const translateX = React.useRef(new Animated.Value(-PREGRESS_BAR_WIDTH)).current;

    React.useEffect(() => {
        const timer = setInterval(() => {
            if (translateX._value < 0 && translateX._value > -PREGRESS_BAR_WIDTH) {
                let value = translateX._value - 0.3;
                value = value < -PREGRESS_BAR_WIDTH ? -PREGRESS_BAR_WIDTH : value;
                translateX.setValue(value);
                // 计算百分比
                const percent = (PREGRESS_BAR_WIDTH - Math.abs(value)) / PREGRESS_BAR_WIDTH * 100;
                DeviceEventEmitter.emit('___@SpeedClick.percent', percent);
            }
        }, 100);
        return () => {
            clearInterval(timer);
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('___@SpeedClick', () => {
            if (translateX._value >= 0)
                return
            let value = translateX._value + 3;
            value = value > 0 ? 0 : value;
            translateX.setValue(value);
            // 完成
            if (value >= 0) {
                DeviceEventEmitter.emit('___@SpeedClick.percent', 100);
            }
        });
        return () => {
            listener.remove();
        }
    })

    return (
        <View style={{ width: '100%', backgroundColor: '#333', alignItems: 'center', overflow: 'hidden' }}>
            <Animated.View style={{ width: '100%', height: 35, backgroundColor: '#669900', transform: [{ translateX: translateX }] }} />
        </View>
    )
}

const TimeDown = (props) => {

    const [seconds, setSeconds] = React.useState(30);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((v) => {
                if (v > 0) {
                    return v - 1;
                }
                // 时间到!!!
                DeviceEventEmitter.emit('___@SpeedClick.timeout');
                clearInterval(timer);
                return 0;
            });
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);

    const label = seconds > 0 ? `剩余 ${seconds} 秒` : '时间已结束';
    return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#000' }}>{label}</Text>
        </View>
    )
}

const TouchCat = (props) => {

    const [image, setImage] = React.useState(IMAGES[0].source);
    const timeout = React.useRef(false);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('___@SpeedClick.percent', (v) => {
            if (v >= 0 && v < 50) {
                setImage(IMAGES[0].source);
            } else if (v >= 50 && v < 100) {
                setImage(IMAGES[1].source);
            } else {
                setImage(IMAGES[2].source);
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('___@SpeedClick.timeout', () => {
            timeout.current = true;
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={styles.viewContainer}>
            <View style={styles.bodyContainer}>
                <View style={styles.topBanner}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <AntDesign name='close' size={24} />
                    </TouchableWithoutFeedback>
                </View>
                <TimeDown />
                <View style={styles.mainContainer}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (!timeout.current) {
                            DeviceEventEmitter.emit('___@SpeedClick');
                        }
                    }}>
                        <FastImage style={{ width: px2pd(675), height: px2pd(675) }} source={image} />
                    </TouchableWithoutFeedback>
                    <ProgressBar />
                </View>
            </View>
        </View>
    )
}

export default TouchCat;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bodyContainer: {
        width: PREGRESS_BAR_WIDTH + 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333', 
        backgroundColor: '#fff',
    },
    mainContainer: {
        width: PREGRESS_BAR_WIDTH, 
        marginTop: 10, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: '#333', 
        backgroundColor: '#ccc',
    },
    topBanner: {
        width: '100%', 
        height: 30, 
        paddingRight: 10, 
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
});

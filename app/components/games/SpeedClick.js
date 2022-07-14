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

const PREGRESS_BAR_WIDTH = px2pd(750);

const IMAGES = [
    { sources: [require('../../../assets/games/speed_click/1.png')] },
    { sources: [require('../../../assets/games/speed_click/2A.png')] },
    { sources: [require('../../../assets/games/speed_click/2B.png')] },
    { sources: [
        require('../../../assets/games/speed_click/3A.png'), 
        require('../../../assets/games/speed_click/3B.png'), 
        require('../../../assets/games/speed_click/3C.png'), 
        require('../../../assets/games/speed_click/3D.png'), 
      ]
    },
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
            let value = translateX._value + 30;
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

    const [seconds, setSeconds] = React.useState(10);

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

const SpeedClick = (props) => {

    const index = React.useRef(0);
    const [images, setImages] = React.useState(IMAGES[index.current].sources);
    const timeout = React.useRef(false);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('___@SpeedClick.percent', (v) => {
            if (v >= 50 && v < 60) {
                if (index.current < 1) {
                    index.current = 1;
                    setImages(IMAGES[index.current].sources);
                } 
            } else if (v >= 90 && v < 100) {
                if (index.current < 2) {
                    index.current = 2;
                    setImages(IMAGES[index.current].sources);
                } 
            } else if (v >= 100) {
                if (index.current < 3) {
                    index.current = 3;
                    setImages(IMAGES[index.current].sources);
                }
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

    let key = 0;
    const imageViews = [];
    images.forEach(e => {
        imageViews.push(<FastImage key={key++} style={{ position: 'absolute', width: px2pd(750), height: px2pd(750) }} source={e} />);
    });

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
                    <FastImage style={{ width: px2pd(750), height: px2pd(750) }} source={require('../../../assets/games/speed_click/bg.png')}>
                        <TouchableWithoutFeedback onPress={() => {
                            if (!timeout.current) {
                                DeviceEventEmitter.emit('___@SpeedClick');
                            }
                        }}>
                        <View>
                            {imageViews}
                        </View>
                        </TouchableWithoutFeedback>
                    </FastImage>
                    <ProgressBar />
                </View>
            </View>
        </View>
    )
}

export default SpeedClick;

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
        // borderWidth: 1, 
        // borderColor: '#333', 
        // backgroundColor: '#ccc',
    },
    topBanner: {
        width: '100%', 
        height: 30, 
        paddingRight: 10, 
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
});

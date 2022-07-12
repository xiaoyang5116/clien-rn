import React from 'react';
import FastImage from 'react-native-fast-image';

import {
    View,
    Text,
    Animated,
    PanResponder,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    StyleSheet,
} from '../../constants'

import { px2pd } from '../../constants/resolution';
import { confirm } from '../dialog/ConfirmDialog';
import AntDesign from 'react-native-vector-icons/AntDesign';

const IMAGES = [
    { source: require('../../../assets/games/cat/1.png'), areas: [{ origin: [86, 125], width: 47, height: 30 }] },
    { source: require('../../../assets/games/cat/2.png'), areas: [{ origin: [86, 125], width: 47, height: 30 }] },
]

const YAN_WU_DU_LIMIT = 3;
const HAO_GAN_DU_LIMIT = 3;

const StatusBar = (props) => {
    const [yanWuDu, setYanWuDu] = React.useState(0);
    const [haoGanDu, setHaoGanDu] = React.useState(0);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@StatusBar.addYanWuDu', (v) => {
            setYanWuDu((du) => {
                const value = du + v;
                if (value >= YAN_WU_DU_LIMIT) {
                    setTimeout(() => {
                        confirm('通关失败!', { title: '确定', cb: () => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }});
                    }, 0);
                    return YAN_WU_DU_LIMIT;
                }
                return value;
            });
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@StatusBar.addHaoGanDu', (v) => {
            setHaoGanDu((du) => {
                const value = du + v;
                if (value >= HAO_GAN_DU_LIMIT) {
                    setTimeout(() => {
                        confirm('通关成功!', { title: '确定', cb: () => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }});
                    }, 0);
                    return HAO_GAN_DU_LIMIT;
                }
                return value;
            })
        });
        return () => {
            listener.remove();
        }
    }, []);

    const yanWuDuWidth = yanWuDu / YAN_WU_DU_LIMIT * 100;
    const haoGanDuWidth = haoGanDu / HAO_GAN_DU_LIMIT * 100;

    return (
        <View style={{ width: '100%', height: 35, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
                <Text>厌恶度: </Text>
                <View style={{ width: 100, height: 20, marginTop: 3, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', left: 0, width: yanWuDuWidth, height: '100%', backgroundColor: '#669900' }} />
                    <Text style={{ color: '#fff' }}>{yanWuDu}/{YAN_WU_DU_LIMIT}</Text>
                </View>
            </View>
            <View>
                <Text>好感度: </Text>
                <View style={{ width: 100, height: 20, marginTop: 3, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', left: 0, width: haoGanDuWidth, height: '100%', backgroundColor: '#669900' }} />
                    <Text style={{ color: '#fff' }}>{haoGanDu}/{HAO_GAN_DU_LIMIT}</Text>
                </View>
            </View>
        </View>
    );
}

const TouchCat = (props) => {

    const speedSet = React.useRef([]);
    const touchTimer = React.useRef(null);
    const detectionAreas = React.useRef(IMAGES[0].areas);
    const [image, setImage] = React.useState(IMAGES[0].source);

    // 地图滑动处理器
    const panResponder = React.useRef(PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            // const { locationX, locationY } = evt.nativeEvent;
            // console.debug('onPanResponderGrant', locationX, locationY);
        },
        onPanResponderMove: (evt, gestureState) => {
            const { dx, dy, moveX, moveY, x0, y0, vx, vy } = gestureState;
            const { locationX, locationY } = evt.nativeEvent;

            if (touchTimer.current != null) {
                clearTimeout(touchTimer.current);
                touchTimer.current = null;
            }

            let inRange = false; // 是否在检测区域
            detectionAreas.current.forEach(e => {
                if ((locationX >= e.origin[0] && locationX <= (e.origin[0] + e.width))
                    && (locationY >= e.origin[1] && locationY <= (e.origin[1] + e.height))) {
                    inRange = true;
                }
            });
            
            if (inRange) {
                const speed = Math.round(vx * 100, 2);
                speedSet.current.push(speed);
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            let totalSpeed = 0;
            speedSet.current.forEach(e => totalSpeed += e);

            // 计算平均速度
            if (speedSet.current.length > 0) {
                const avgSpeed = Math.abs(totalSpeed / speedSet.current.length);
                // 移动速度符合则增加好感度，否则增加厌恶度
                if (avgSpeed >= 10 && avgSpeed <= 50) {
                    DeviceEventEmitter.emit('__@StatusBar.addHaoGanDu', 1);
                } else {
                    DeviceEventEmitter.emit('__@StatusBar.addYanWuDu', 1);
                }
            }

            speedSet.current.length = 0;
        },
    })).current;

    const touchEventHandler = (e) => {
        const { locationX, locationY } = e.nativeEvent;

        if (touchTimer.current != null) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }

        let inRange = false; // 是否在检测区域
        detectionAreas.current.forEach(e => {
            if ((locationX >= e.origin[0] && locationX <= (e.origin[0] + e.width))
                && (locationY >= e.origin[1] && locationY <= (e.origin[1] + e.height))) {
                inRange = true;
            }
        });

        if (inRange) { // 单纯点击算厌恶
            touchTimer.current = setTimeout(() => {
                DeviceEventEmitter.emit('__@StatusBar.addYanWuDu', 1);
            }, 600);
        }
    }

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
                <StatusBar {...props} />
                <View style={styles.mainContainer} {...panResponder.panHandlers} onTouchStart={touchEventHandler}>
                    <FastImage style={{ width: px2pd(675), height: px2pd(675) }} source={image} />
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
        width: px2pd(850) + 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#333', 
        backgroundColor: '#fff',
    },
    mainContainer: {
        width: px2pd(850), 
        marginTop: 10, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: '#333', 
        // backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBanner: {
        width: '100%', 
        height: 30, 
        paddingRight: 10, 
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
});

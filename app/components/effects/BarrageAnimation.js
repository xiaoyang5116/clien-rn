import React from 'react';

import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    DeviceEventEmitter,
} from 'react-native';

import { 
    getWindowSize 
} from '../../constants';

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Easing from 'react-native/Libraries/Animated/Easing';

const WIN_SIZE = getWindowSize();

// 缺省测试数据
const DATA = [
    { title: '弹幕测试内容A', posIdx: 0, speed: 15 },
    { title: '弹幕测试内容B', posIdx: 1, speed: 10 },
    { title: '弹幕测试内容B!!!!', posIdx: 1, speed: 10, delay: 2000 },
    { title: '弹幕测试内容C', posIdx: 2, speed: 15 },

    { title: '弹幕测试内容D', posIdx: 3, speed: 7 },
    { title: '弹幕测试内容E', posIdx: 4, speed: 9, delay: 1000 },
    { title: '弹幕测试内容F', posIdx: 5, speed: 15 },

    { title: '弹幕测试内容G', posIdx: 6, speed: 10, delay: 1000 },
    { title: '弹幕测试内容H', posIdx: 7, speed: 6, delay: 1000 },
    { title: '弹幕测试内容I', posIdx: 8, speed: 8, delay: 1000 },
]

const BarrageItem = (props) => {

    const translateX = React.useRef(new Animated.Value(0)).current;
    const validSpeed = (lo.isNumber(props.speed) && props.speed > 0) ? props.speed : 20;

    const layoutHandler = (e) => {
        const { width, height } = e.nativeEvent.layout;
        const t = WIN_SIZE.width / (validSpeed / 100);

        const animations = [];
        if (lo.isNumber(props.delay) && props.delay > 0) {
            animations.push(Animated.delay(props.delay));
        }
        animations.push(
            Animated.timing(translateX, {
                toValue: -(WIN_SIZE.width + width),
                duration: t,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        Animated.sequence(animations).start(r => {
            const { finished } = r;
            if (finished) {
                DeviceEventEmitter.emit('__@BarrageItem.completed');
            }
        });
    }

    return (
        <Animated.View style={{ position: 'absolute', left: WIN_SIZE.width, top: (props.posIdx * 35), transform: [{ translateX: translateX }] }} onLayout={layoutHandler}>
            <Text style={{
                color: '#fff',
                fontSize: 28,
                textShadowColor: '#000', 
                textShadowRadius: 2, 
                shadowOpacity: 0,
            }}>{props.title}</Text>
        </Animated.View>
    );
}

const BarrageAnimation = (props) => {

    const data = (lo.isArray(props.data) && props.data.length > 0) ? props.data : DATA;
    const counter = React.useRef(data.length);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@BarrageItem.completed', () => {
            counter.current -= 1;
            if (counter.current <= 0) {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    let key = 0;
    const items = [];
    data.forEach(e => {
        items.push(<BarrageItem key={key++} {...e} />);
    });

    return (
        <View style={styles.viewContainer}>
            {/* <TouchableWithoutFeedback onPress={() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}>
                <View style={{ }}>
                    <AntDesign name='close' size={30} />
                </View>
            </TouchableWithoutFeedback> */}
            <View style={{ width: '100%', height: 500 }}>
                {items}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default BarrageAnimation;

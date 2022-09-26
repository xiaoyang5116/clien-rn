import React from 'react';

import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
    Animated,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    SafeAreaView,
    DeviceEventEmitter,
} from 'react-native';
import RootView from '../RootView';
import PropsPage from '../../pages/home/PropsPage';
import { EventKeys } from '../../constants';

const PropsWrapper = (props) => {
    return (
        <View style={[styles.viewContainer2, { backgroundColor: props.readerStyle.bgColor }]}>
            <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '96%', height: '86%', marginTop: 40, marginBottom: 40, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.75)' }}>
                    <PropsPage />
                </View>
                <View style={{ position: 'absolute', top: 15, left: 10 }}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <AntDesign name='left' size={30} color={'#333'} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            </SafeAreaView>
        </View>
    );
}

const BagAnimation = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;

    const refAnimation = React.useRef(
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.delay(6 * 1000),
        ])).current;

    React.useEffect(() => {
        refAnimation.start(({ finished }) => {
            if (finished) {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }
        });
        return () => {
            refAnimation.stop();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.OPTION_CLICKED, () => {
            refAnimation.stop();
            if (props.onClose != undefined) {
                props.onClose();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={[styles.viewContainer]} pointerEvents='box-none'>
            <Animated.View style={{ position: 'absolute', bottom: 30, right: 30 }}>
                <TouchableWithoutFeedback onPress={() => {
                    setTimeout(() => {
                        const key = RootView.add(<PropsWrapper {...props} onClose={() => {
                            RootView.remove(key);
                        }} />);
                    }, 0);
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}>
                    <Animated.Image style={{ width: px2pd(210), height: px2pd(210), transform: [{ scale: scale }] }} source={require('../../../assets/button/collect_bag1.png')} />
                </TouchableWithoutFeedback>
            </Animated.View>
        </View>
    );
}

export default BagAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        position: 'absolute',
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    viewContainer2: {
        flex: 1,
    },
});

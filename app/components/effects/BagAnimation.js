import React from 'react';
import lo from 'lodash';

import { px2pd } from '../../constants/resolution';

import {
    Animated,
    View,
    StyleSheet,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';
import RootView from '../RootView';
import PropsTabPage from '../../pages/home/PropsTabPage';

const PropsWrapper = (props) => {
    return (
        <View>
            <PropsTabPage />
        </View>
    );
}

const BagAnimation = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
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
            Animated.delay(20 * 1000),
          ]).start(r => {
            const { finished } = r;
            if (finished) {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }
          });
    }, []);

    return (
        <View style={styles.viewContainer} pointerEvents='box-none'>
            <View style={{ position: 'absolute', bottom: 30, right: 30 }}>
                <TouchableWithoutFeedback onPress={() => {
                }}>
                    <Animated.Image style={{ width: px2pd(210), height: px2pd(210), transform: [{ scale: scale }] }} source={require('../../../assets/button/collect_bag1.png')} />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

export default BagAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

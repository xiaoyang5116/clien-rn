import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
} from '../../constants/native-ui';

import { 
    Animated, DeviceEventEmitter,
} from 'react-native';

import { EventKeys } from '../../constants';

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';

const ColorScreenImageTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const colorOpacity = React.useRef(new Animated.Value(1)).current;
    const imageOpacity = React.useRef(new Animated.Value(1)).current;
    const translateX = React.useRef(new Animated.Value(0)).current;

    const trans = () => {
        Animated.sequence([
            Animated.timing(colorOpacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(translateX, {
                toValue: -70,
                duration: 1600,
                useNativeDriver: false,
            }),
            Animated.delay(300),
            Animated.timing(imageOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            })
        ]).start(({ finished }) => {
            if (finished) {
                setPointerEvents('none');
                if (props.onCompleted != undefined) {
                    props.onCompleted();
                }
            }
        });
    }

    React.useEffect(() => {
        // 指定时间触发
        if (props.config != undefined 
            && props.config.duration != undefined) {
            setTimeout(() => {
                DeviceEventEmitter.emit(EventKeys.SCREEN_TRANSITION_START, 'ColorScreenImageTransition');
            }, props.config.duration);
        }
        // 通过消息触发(解决一些需要加载的例如MP4视频的情况)
        const listener = DeviceEventEmitter.addListener(EventKeys.SCREEN_TRANSITION_START, (name) => { 
            if (lo.isEqual(name, 'ColorScreenImageTransition')) {
                trans();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {props.children}
            <Animated.View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} pointerEvents={pointerEvents}>
                <Animated.Image 
                    source={require('../../../assets/bg/screen_trans_bg1.jpg')} 
                    style={{ 
                        width: px2pd(1160), height: px2pd(1536), 
                        transform: [{ scale: 1.53 }, { translateX: translateX }],
                        opacity: imageOpacity,
                    }} 
                />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', zIndex: 99, width: '100%', height: '100%', backgroundColor: props.color, opacity: colorOpacity }} pointerEvents={pointerEvents} />
        </View>
    )
}

export default ColorScreenImageTransition;

ColorScreenImageTransition.propTypes = {
    color: PropTypes.string,
    image: PropTypes.number,
    onCompleted: PropTypes.func,
};

ColorScreenImageTransition.defaultProps = {
    color: '#000',
    image: require('../../../assets/bg/screen_trans_bg1.jpg'),
};
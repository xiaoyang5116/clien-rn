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

const ColorScreenTransition = (props) => {

    const [pointerEvents, setPointerEvents] = React.useState('auto');
    const opacity = React.useRef(new Animated.Value(1)).current;

    const trans = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start((r) => {
            const { finished } = r;
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
                DeviceEventEmitter.emit(EventKeys.SCREEN_TRANSITION_START, 'ColorScreenTransition');
            }, props.config.duration);
        }
        // 通过消息触发(解决一些需要加载的例如MP4视频的情况)
        const listener = DeviceEventEmitter.addListener(EventKeys.SCREEN_TRANSITION_START, (name) => { 
            if (lo.isEqual(name, 'ColorScreenTransition')) {
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
            <Animated.View style={{ position: 'absolute', zIndex: 99, width: '100%', height: '100%', backgroundColor: props.color, opacity: opacity }} pointerEvents={pointerEvents} />
        </View>
    )
}

export default ColorScreenTransition;

ColorScreenTransition.propTypes = {
    color: PropTypes.string,
    onCompleted: PropTypes.func,
};

ColorScreenTransition.defaultProps = {
    color: '#000',
};
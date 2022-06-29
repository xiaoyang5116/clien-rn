import React from 'react';

import { Animated, Easing } from 'react-native';

import {
    Component,
    StyleSheet,
    DeviceEventEmitter,
    EventKeys,
} from "../../../constants";

import { 
    View, 
    Text, 
} from '../../../constants/native-ui';
import { TIME_BANNER_CONFIG } from './config';

// 事件单元
const BannerBox = (props) => {
    const [ display, setDisplay ] = React.useState('flex');

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.EXPLORE_BOX_HIDE, (idx) => {
            if (props.id == idx) {
                setDisplay('none');
            }
        });
        return (() => {
            listener.remove();
        });
    }, []);

    return (
        <View style={[styles.mxPoint, { left: props.id * TIME_BANNER_CONFIG.space, display: display }]}>
            <Text>{props.id}</Text>
        </View>
    );
}

// 时间事件条，用于展现随时间播放的动效
class TimeBanner extends Component {
    constructor(props) {
        super(props);
        this.eventNum = props.time / props.interval;
        this.bannerLeftValue = new Animated.Value(TIME_BANNER_CONFIG.startOffset);
        this.listeners = [];
        this.pause = false;

        const animations = [];
        let offset = TIME_BANNER_CONFIG.startOffset;
        for (let i = 0; i < this.eventNum; i++) {
            offset -= TIME_BANNER_CONFIG.space;
            const item = Animated.timing(this.bannerLeftValue, {
                toValue: offset,
                duration: (props.interval * 1000),
                easing: Easing.linear,
                useNativeDriver: true,
            });
            animations.push(item);
            animations.push({
                start: cb => {
                    if (!this.pause) {
                        setTimeout(() => props.onStep(i), 0); // 必须放在下一个执行周期，否则无法保证finished:false 执行有效。
                        this.pause = true;
                        cb({ finished: false });
                    } else {
                        this.pause = false;
                        cb({ finished: true });
                    }
                },
                stop: () => {
                },
            })
        }
        this.sequence = Animated.sequence(animations);
    }

    resume() {
        this.sequence.start();
    }

    hide(idx) {
        DeviceEventEmitter.emit(EventKeys.EXPLORE_BOX_HIDE, idx);
    }

    componentDidMount() {
        this.listeners.push(DeviceEventEmitter.addListener(EventKeys.EXPLORE_TIMEBANNER_HIDE, (idx) => this.hide(idx)));
        this.listeners.push(DeviceEventEmitter.addListener(EventKeys.EXPLORE_TIMEBANNER_RESUME, () => this.resume()));
        this.sequence.start();
    }

    componentWillUnmount() {
        this.listeners.forEach(e => e.remove());
        this.listeners.length = 0;
        this.sequence.stop();
    }

    render() {
        const childs = [];
        for (let i = 0; i < this.eventNum; i++) {
            childs.push(<BannerBox key={i} id={i} />);
        }
        return (
            <Animated.View style={{ position: 'absolute', top: 0, left: 0, transform: [{ translateX: this.bannerLeftValue }] }}>
                {childs}
            </Animated.View>
        );
    }
}

export default TimeBanner;

const styles = StyleSheet.create({
    mxPoint: {
        position: 'absolute', left: 330, top: 20,
        width: 20, height: 20, borderColor: '#666', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    },
});
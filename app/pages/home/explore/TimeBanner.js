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
class BannerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 1,
        }
    }

    hide() {
        this.setState({ opacity: 0 });
    }

    render() {
        return (
        <View style={[styles.mxPoint, { left:  this.props.id * TIME_BANNER_CONFIG.space, opacity: this.state.opacity }]}>
            <Text>{this.props.id}</Text>
        </View>
        );
    }
}

// 时间事件条，用于展现随时间播放的动效
class TimeBanner extends Component {
    constructor(props) {
        super(props);
        this.eventNum = props.time / props.interval;
        this.bannerLeftValue = new Animated.Value(TIME_BANNER_CONFIG.startOffset);
        this.events = [];
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
                useNativeDriver: false,
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
        const currentEvent = this.events.find(e => e.id == idx);
        if (currentEvent != undefined && currentEvent.ref.current != null) {
            currentEvent.ref.current.hide();
        }
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
            const ref = React.createRef();
            childs.push(<BannerBox ref={ref} key={i} id={i} />);
            this.events.push({ id: i, ref: ref });
        }
        return (
            <Animated.View style={{ position: 'absolute', left: this.bannerLeftValue, top: 0 }}>
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
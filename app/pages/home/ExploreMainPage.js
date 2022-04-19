import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { 
    View, 
    Text, 
    Image,
    FlatList, 
    SafeAreaView, 
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import { Animated, Easing } from 'react-native';
import RootView from '../../components/RootView';
import Toast from '../../components/toast';
import lo from 'lodash';

const CONFIG = {
    // 事件的间隔
    space: 100,

    // 事件起始偏移
    startOffset: 200,
}

const PROPS_ICON = [
    { iconId: 1, img: require('../../../assets/props/prop_1.png') },
    { iconId: 2, img: require('../../../assets/props/prop_2.png') },
    { iconId: 3, img: require('../../../assets/props/prop_3.png') },
    { iconId: 4, img: require('../../../assets/props/prop_4.png') },
    { iconId: 5, img: require('../../../assets/props/prop_5.png') },
];

// 奖励物品组件
const RewardItem = (props) => {
    const icon = PROPS_ICON.find(e => e.iconId == props.iconId);
    return (
    <View style={{ flexDirection: 'column', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 68, height: 68 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#ccc', borderWidth: 0, backgroundColor: '#333' }}>
                <Image source={icon.img} />
                <Text style={{ position: 'absolute', top: 53, right: 0, color: '#fff' }}>{props.num}</Text>
            </View>
        </View>
        <Text style={{ color: '#000', marginTop: 3 }}>{props.name}</Text>
    </View>
    );
}

// 储物袋页面
const RewardsPage = (props) => {
    const childs = [];
    let key = 0;
    props.data.forEach(e => {
        childs.push(<RewardItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} />);
    });
    return (
        <TouchableWithoutFeedback onPress={() => { 
                props.dispatch(action('ExploreModel/getRewards')({}))
                .then(r => {
                    props.onClose();
                });
            }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>储物袋</Text>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                    {childs}
                </View>
                <View>
                    <Text style={{ color: '#fff', lineHeight: 35, }}>点击任意区域领取奖励</Text>
                    <TextButton title={'领取奖励'} {...props} onPress={() => {
                        props.dispatch(action('ExploreModel/getRewards')({}))
                        .then(r => {
                            props.onClose();
                        });
                    }} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

// 事件单元
class BannerEvent extends Component {
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
        <View style={[styles.mxPoint, { left:  this.props.id * CONFIG.space, opacity: this.state.opacity }]}>
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
        this.bannerLeftValue = new Animated.Value(CONFIG.startOffset);
        this.events = [];
        this.pause = false;

        const animations = [];
        let offset = CONFIG.startOffset;
        for (let i = 0; i < this.eventNum; i++) {
            offset -= CONFIG.space;
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
                        props.onStep(i);
                        this.pause = true;
                        cb({ finished: false });
                    } else {
                        this.pause = false;
                        cb({ finished: true });
                    }
                },
            })
        }
        this.sequence = Animated.sequence(animations);
    }

    resume() {
        setTimeout(() => {
            this.sequence.start();
        }, 0);
    }

    hide(idx) {
        const currentEvent = this.events.find(e => e.id == idx);
        if (currentEvent != undefined) {
            currentEvent.ref.current.hide();
        }
    }

    componentDidMount() {
        this.sequence.start();
    }

    render() {
        const childs = [];
        for (let i = 0; i < this.eventNum; i++) {
            const ref = React.createRef();
            childs.push(<BannerEvent ref={ref} key={i} id={i} />);
            this.events.push({ id: i, ref: ref });
        }
        return (
            <Animated.View style={{ position: 'absolute', left: this.bannerLeftValue, top: 0 }}>
                {childs}
            </Animated.View>
        );
    }
}

// 消息列表，用于展现探索的各种信息
class MessageList extends Component {
    constructor(props) {
        super(props);
        this.refList = React.createRef();
        this.state = {
            messages: [],
        };
    }

    renderItem = (data) => {
        const item = data.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ lineHeight: 24 }}>{item.msg}</Text>
            </View>
        );
    }

    addMsg(msg) {
        this.setState({ messages: [...this.state.messages, { msg }] });
    }

    render() {
        return (
        <FlatList
            ref={this.refList}
            style={{ alignSelf: 'stretch', margin: 10, borderColor: '#999', borderWidth: 1, backgroundColor: '#fff' }}
            data={this.state.messages}
            renderItem={this.renderItem}
            getItemLayout={(_data, index) => (
                {length: 24, offset: 24 * index, index}
            )}
            onContentSizeChange={() => {
                if (this.state.messages.length > 0) {
                    this.refList.current.scrollToIndex({ index: this.state.messages.length - 1 });
                }
            }}
          />
        );
    }
}

// 探索主页面
class ExploreMainPopPage extends Component {

    constructor(props) {
        super(props);
        this.refMsgList = React.createRef();
        this.refTimeBanner = React.createRef();
    }

    // 时间滚动条-事件触发
    onStep = (idx) => {
        this.props.dispatch(action('ExploreModel/onTimeEvent')({
            idx,
            refTimeBanner: this.refTimeBanner.current, 
            refMsgList: this.refMsgList.current, 
        }));
    }

    showBag() {
        this.props.dispatch(action('ExploreModel/showBag')({}))
        .then(data => {
            if (lo.isArray(data)) {
                if (data.length > 0) {
                    const key = RootView.add(<RewardsPage {...this.props} data={data} onClose={() => {
                        Toast.show('奖励已领取!', 'CenterToTop');
                        RootView.remove(key);
                    }} />);
                } else {
                    Toast.show('没有奖励!!!');
                }
            }
        });
    }

    render() {
        const allMaps = [];
        this.props.maps.forEach(e => allMaps.push(...e));
        const mapSelected = allMaps.find(e => e.id == this.props.mapId);
        const currentArea = mapSelected.areas.find(e => e.id == this.props.areaId);

        return (
            <FastImage style={{ flex: 1 }} source={require('../../../assets/explore_bg.jpg')} >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>{mapSelected.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', margin: 10, height: 160, justifyContent: 'center', alignItems: 'center' }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>背景图</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%',  height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                            <View style={styles.eventBox}>
                                <Text>寻宝</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>战斗</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>线索</Text>
                            </View>
                            <View style={styles.eventBox}>
                                <Text>奇遇</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>{currentArea.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>探索度 100/100</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={styles.textBox}>补给[预留位置]</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <MessageList ref={this.refMsgList} />
                    </View>
                    <View style={styles.timeBannerContainer} >
                        <TimeBanner key={this.props.areaId * 100} ref={this.refTimeBanner} time={currentArea.time} interval={currentArea.interval} onStep={this.onStep} />
                        <View style={{ position: 'absolute', left: 100, top: 0, width: 10, height: '100%', backgroundColor: '#669900', opacity: 0.75 }} />
                    </View>
                    <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'预留'} onPress={() => { }} disabled={true} />
                        <TextButton {...this.props} title={'储物袋'} onPress={() => { this.showBag(); }} />
                        <TextButton {...this.props} title={'预留'} onPress={() => {}} disabled={true} />
                    </View>
                    <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-around', alignItems: 'center' }} >
                        <TextButton {...this.props} title={'结束探索'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'加速'} onPress={() => {
                            this.props.onClose();
                        }} />
                        <TextButton {...this.props} title={'全部加速'} onPress={() => {
                            this.props.onClose();
                        }} />
                    </View>
                </View>
            </SafeAreaView>
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
    eventBox: {
        width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderColor: '#999', borderWidth: 1, backgroundColor: '#eee',
    },
    textBox: {
        borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
    },
    mxPoint: {
        position: 'absolute', left: 330, top: 20,
        width: 20, height: 20, borderColor: '#666', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    },
    timeBannerContainer: {
        flexDirection: 'row', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', overflow: 'hidden', 
        marginLeft: 10, marginRight: 10, height: 60, justifyContent: 'space-around', alignItems: 'center'
    },
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMainPopPage);
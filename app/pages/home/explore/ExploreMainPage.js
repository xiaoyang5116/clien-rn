import React from 'react';
import lo from 'lodash';
import { ImageBackground } from 'react-native'

import {
    action,
    connect,
    Component,
    StyleSheet,
    DeviceEventEmitter,
    EventKeys,
    ThemeContext,
} from "../../../constants";

import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableWithoutFeedback,
} from '../../../constants/native-ui';

import { TextButton } from '../../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import RootView from '../../../components/RootView';
import Toast from '../../../components/toast';

import ExploreXunBaoPage from './ExploreXunBaoPage';
import ExploreBossPage from './ExploreBossPage';
import ExploreXianSuoPage from './ExploreXianSuoPage';
import ExploreQiYuPage from './ExploreQiYuPage';
import MessageList from './MessageList';
import TimeBanner from './TimeBanner';
import { PROPS_ICON } from './config';
import { px2pd } from '../../../constants/resolution';

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
    const theme = React.useContext(ThemeContext)
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
                <ImageBackground style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }} source={theme.blockBg_5_img}>
                    {childs}
                </ImageBackground>
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

// 寻宝、战斗、线索、奇遇等事件按钮
const EventButton = (props) => {
    const [num, setNum] = React.useState(0);
    const [disabled, setDisabled] = React.useState(false);

    React.useEffect(() => {
        const updateListener = DeviceEventEmitter.addListener(EventKeys.EXPLORE_UPDATE_EVENT_NUM, ({ type, num }) => {
            if (type == props.id) {
                setNum(num);
            }
        });
        const pkBeginListener = DeviceEventEmitter.addListener(EventKeys.EXPLORE_PK_BEGIN, () => {
            setDisabled(true);
        });
        const pkEndListener = DeviceEventEmitter.addListener(EventKeys.EXPLORE_PK_END, () => {
            setDisabled(false);
        });
        return (() => {
            updateListener.remove();
            pkBeginListener.remove();
            pkEndListener.remove();
        });
    }, []);

    return (
        <View style={styles.eventBox}>
            <TextButton title={props.title} {...props} style={styles.eventButton} disabled={disabled} onPress={() => { props.onPress(); }} />
            <Text style={{ lineHeight: 24, color: '#111' }}>{num}</Text>
        </View>
    );
}

const ExploreProgress = (props) => {
    const [progress, setProgress] = React.useState(props.progress);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.EXPLORE_UPDATE_PROGRESS, (v) => {
            setProgress(v);
        });
        return (() => {
            listener.remove();
        });
    }, []);

    return (
        <Text style={{ ...props.style }}>探索度 {progress}/100</Text>
    );
};

// 探索主页面
class ExploreMainPopPage extends Component {

    static contextType = ThemeContext

    constructor(props) {
        super(props);
    }

    // 时间滚动条-事件触发
    onStep = (idx) => {
        this.props.dispatch(action('ExploreModel/onTimeEvent')({ idx }));
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

    showXunBao() {
        const key = RootView.add(<ExploreXunBaoPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    showBoss() {
        const key = RootView.add(<ExploreBossPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    showXianSuo() {
        const key = RootView.add(<ExploreXianSuoPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    showQiYu() {
        const key = RootView.add(<ExploreQiYuPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    render() {
        const allMaps = [];
        this.props.maps.forEach(e => allMaps.push(...e));
        const mapSelected = allMaps.find(e => e.id == this.props.mapId);
        const currentArea = mapSelected.areas.find(e => e.id == this.props.areaId);

        return (
            <FastImage style={{ flex: 1 }} source={this.context.profileBg} >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center', marginTop: 12 }} >
                            <Text style={styles.textBox}>{mapSelected.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', margin: 10, height: 160, justifyContent: 'center', alignItems: 'center' }} >
                            <FastImage style={{ flex: 1, overflow: 'hidden' }} source={this.context.blockBg_2_img} resizeMode='stretch' >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                                <View style={{ flexDirection: 'row', width: '100%', height: 80, justifyContent: 'space-around', alignItems: 'center' }} >
                                    <EventButton id={'xunbao'} title={'寻宝'} {...this.props} onPress={() => { this.showXunBao() }} />
                                    <EventButton id={'boss'} title={'战斗'} {...this.props} onPress={() => { this.showBoss() }} />
                                    <EventButton id={'xiansuo'} title={'线索'} {...this.props} onPress={() => { this.showXianSuo() }} />
                                    <EventButton id={'qiyu'} title={'奇遇'} {...this.props} onPress={() => { this.showQiYu() }} />
                                </View>
                            </FastImage>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={styles.textBox}>{currentArea.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                            <ExploreProgress style={styles.textBox} progress={mapSelected.progress} />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={styles.textBox}>补给[预留位置]</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ImageBackground style={{ flex: 1, margin: 10, }} resizeMode={"stretch"} source={this.context.blockBg_4_img}>
                                <MessageList />
                            </ImageBackground>
                        </View>
                        <View style={styles.timeBannerContainer} >
                            <TimeBanner key={this.props.areaId * 100} time={currentArea.time} interval={currentArea.interval} onStep={this.onStep} />
                            <FastImage style={{ position: 'absolute', left: 70, width: px2pd(185), height: px2pd(166) }} source={require('../../../../assets/bg/explore_person.png')} />
                        </View>
                        <View style={{ flexDirection: 'row', height: 80, justifyContent: 'space-evenly', alignItems: 'center' }} >
                            <TextButton {...this.props} title={'终止'} onPress={() => {
                                this.props.onClose();
                            }} />
                            <TextButton {...this.props} title={'储物袋'} onPress={() => { this.showBag(); }} />
                            <TextButton {...this.props} title={'预留'} onPress={() => { }} disabled={true} />
                        </View>
                        <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-evenly', alignItems: 'center' }} >
                            <TextButton {...this.props} title={'返回'} onPress={() => { }} disabled={true} />
                            <TextButton {...this.props} title={'加速'} onPress={() => { }} disabled={true} />
                            <TextButton {...this.props} title={'全部加速'} onPress={() => { }} disabled={true} />
                        </View>
                    </View>
                </SafeAreaView>
            </FastImage>
        );
    }
}

const styles = StyleSheet.create({
    eventBox: {
        width: 80, height: 80, justifyContent: 'center', alignItems: 'center',
    },
    eventButton: {
        width: 60, height: 60, justifyContent: 'center', alignItems: 'center',
    },
    textBox: {
        borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5,
    },
    timeBannerContainer: {
        flexDirection: 'row', borderColor: '#999', borderWidth: 1, backgroundColor: '#ddd', overflow: 'hidden',
        marginLeft: 10, marginRight: 10, height: 60, justifyContent: 'space-around', alignItems: 'center'
    },
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreMainPopPage);
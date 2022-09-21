import React from 'react';

import { 
    Animated, 
    DeviceEventEmitter, 
    Easing, 
    SafeAreaView, 
    ScrollView, 
    TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';

import {
    AppDispath,
    connect,
    EventKeys,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';
import { px2pd } from '../../constants/resolution';
import PropGrid from '../../components/prop/PropGrid';
import { Panel } from '../../components/panel';
import RootView from '../../components/RootView';
import * as DateTime from '../../utils/DateTimeUtils';
import TuPoSubPage from './xiuxing/TuPoSubPage';

const PROGRESS_BAR_WIDTH = px2pd(800);

// 进度条
const ProgressBar = (props) => {

    const translateX = React.useRef(new Animated.Value(-PROGRESS_BAR_WIDTH)).current;

    React.useEffect(() => {
        let percent = props.value / props.limit;
        percent = (percent > 1) ? 1 : percent;
        const progressWidth = (1 - percent) * PROGRESS_BAR_WIDTH;

        translateX.setValue(-PROGRESS_BAR_WIDTH);
        Animated.timing(translateX, {
         toValue: -progressWidth,
         duration: 600,
         easing: Easing.cubic,
         useNativeDriver: true,   
        }).start();
    })

    const percent = parseFloat(Number((props.value/props.limit)*100).toFixed(2));

    return (
        <View style={{ width: '100%', backgroundColor: '#3f3e3a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#000', borderRadius: 3 }}>
            <Animated.View style={{ width: '100%', height: 35, backgroundColor: '#4d6daf', transform: [{ translateX: translateX }] }} />
            <View style={{ position: 'absolute' }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>{props.value} / {props.limit} ({percent}%)</Text>
            </View>
        </View>
    )
}

// 药品道具栏
const PropsBar = (props) => {
    const GET_PROPS_CALLBACK = '__@XiuXingPropsBar.getProps';

    const [items, setItems] = React.useState([]);

    const useProp = (e) => {
        AppDispath({ type: 'PropsModel/use', payload: { propId: e.id, num: 1 }, cb: () => {
            AppDispath({ type: 'PropsModel/getPropsFromAttr', payload: { attr: '修行丹' }, retmsg: GET_PROPS_CALLBACK });
        }});
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(GET_PROPS_CALLBACK, (data) => {
            const views = [];
            lo.forEach(data, (v, k) => {
                views.push(
                <TouchableWithoutFeedback key={k} onPress={() => useProp(v)}>
                    <PropGrid prop={v} style={{ marginRight: 10 }} imageStyle={{ width: px2pd(120), height: px2pd(120) }} showNum={true} labelStyle={{ color: '#000' }} />
                </TouchableWithoutFeedback>
                );
            });
            setItems(views);
        });
        AppDispath({ type: 'PropsModel/getPropsFromAttr', payload: { attr: '修行丹' }, retmsg: GET_PROPS_CALLBACK });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View style={{ height: px2pd(210), paddingLeft: 10, paddingRight: 10, backgroundColor: '#beb9b3', alignItems: 'center', justifyContent: 'center' }}>
            {
            (items.length > 0)
            ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
                {items}
            </ScrollView>
            )
            : (
            <>
                <Text style={{ lineHeight: 24, color: '#000' }}>使用道具可以加速修行</Text>
                <Text style={{ lineHeight: 24, color: '#000' }}>当前没有可用的道具</Text>
            </>
            )
            }
        </View>
    );
}

// 主界面
const XiuXingTabPage = (props) => {

    const refBgVideo = React.useRef(null);

    React.useEffect(() => {
        AppDispath({ type: 'UserModel/checkXiuXing', payload: {} });
    }, []);

    const onTuPo = () => {
        const key = RootView.add(<TuPoSubPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    const getXiuXingAttrValue = (key) => {
        const found = props.user.xiuxingAttrs.find(e => lo.isEqual(e.key, key));
        return (found != undefined) ? found.value : 0;
    }

    const currentXiuXingConfig = props.user.__data.xiuxingConfig.find(e => e.limit == props.user.xiuxingStatus.limit);
    const cdForbiden = (props.user.xiuxingStatus.cdTime > 0 && DateTime.now() < props.user.xiuxingStatus.cdTime);

    return (
        <Panel patternId={0}>
            <Video 
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                ref={(ref) => refBgVideo.current = ref}
                source={require('../../../assets/mp4/XIUXING_BG.mp4')}
                fullscreen={false}
                resizeMode={'cover'}
                repeat={true}
                onEnd={() => {}}
                onReadyForDisplay={() => {
                    DeviceEventEmitter.emit(EventKeys.SCREEN_TRANSITION_START, 'ColorScreenTransition');
                }}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.viewContainer}>
                    <View style={{ width: '90%', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 26, color: '#fff', fontWeight: 'bold' }}>修行</Text>
                        <AntDesign style={{ position: 'absolute', left: -10 }} name='left' size={30} color={'#333'} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                    <View style={{ width: '90%', marginTop: 10, borderRadius: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: '#677d8e', flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>体力： {getXiuXingAttrValue('体力')}</Text></View>
                        <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>防御： {getXiuXingAttrValue('防御')}</Text></View>
                        <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>法力： {getXiuXingAttrValue('法力')}</Text></View>
                        <View style={{ width: '50%', alignItems: 'center' }}><Text style={{ lineHeight: 30, color: '#fff', fontWeight: 'bold' }}>攻击： {getXiuXingAttrValue('攻击')}</Text></View>
                    </View>
                    <View style={{ marginTop: px2pd(550), justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', paddingLeft: px2pd(40) }}>
                            <TextButton title={'突破'} disabled={((props.user.xiuxingStatus.value < props.user.xiuxingStatus.limit) || cdForbiden)} onPress={onTuPo} />
                        </View>
                        {
                        (cdForbiden)
                        ? (
                        <View style={{ position: 'absolute', bottom: 35 }}>
                            <Text style={styles.cdFontStyle}>等待时间: {DateTime.format(props.user.xiuxingStatus.cdTime, 'yyyyMMdd hh:mm:ss')}</Text>
                        </View>
                        )
                        : <></>
                        }
                    </View>
                    <View style={{ marginTop: px2pd(100) }}>
                        <Text style={{ fontSize: 24, color: '#eee' }}>{currentXiuXingConfig.title}</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{ width: PROGRESS_BAR_WIDTH, height: 40 }}>
                            <ProgressBar value={props.user.xiuxingStatus.value} limit={props.user.xiuxingStatus.limit} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' , marginTop: 10 }}>
                        <Text style={{ fontSize: 22, color: '#ccc' }}>修为：</Text>
                        <Text style={{ fontSize: 22, color: '#829358' }}>+{currentXiuXingConfig.increaseXiuXingPerMinute}/分钟</Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 20, backgroundColor: '#565452' }}>
                        <View style={{ marginLeft: 3, marginRight: 3, marginTop: 5, marginBottom: 5, borderWidth: 1, borderColor: '#494745' }}>
                            <PropsBar />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Panel>
    );

}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cdFontStyle: {
        color: '#829358', 
        fontWeight: 'bold', 
        fontSize: 12, 
        textShadowColor: '#000', 
        textShadowRadius: 2, 
        shadowOpacity: 0,
    }
});

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(XiuXingTabPage);
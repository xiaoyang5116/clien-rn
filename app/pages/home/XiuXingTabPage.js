import React from 'react';

import {
    AppDispath,
    connect,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
} from '../../constants/native-ui';

import { 
    Animated, DeviceEventEmitter, Easing, SafeAreaView, ScrollView, TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { TextButton } from '../../constants/custom-ui';
import { px2pd } from '../../constants/resolution';
import PropGrid from '../../components/prop/PropGrid';
import { Panel } from '../../components/panel';
import RootView from '../../components/RootView';
import PropSelector from '../../components/prop/PropSelector';
import Toast from '../../components/toast';
import * as DateTime from '../../utils/DateTimeUtils';

const PROGRESS_BAR_WIDTH = px2pd(800);

// 进度条
const ProgressBar = (props) => {

    const translateX = React.useRef(new Animated.Value(-PROGRESS_BAR_WIDTH)).current;

    React.useEffect(() => {
        let percent = props.value / props.limit;
        percent = (percent > 1) ? 1 : percent;
        const progressWidth = (1 - percent) * PROGRESS_BAR_WIDTH;

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
                    <PropGrid prop={v} style={{ marginRight: 10 }} labelStyle={{ color: '#000' }} />
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
        <View style={{ height: 100, backgroundColor: '#beb9b3' }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} style={{ marginLeft: 10, marginRight: 10, marginTop: 20 }}>
                {items}
            </ScrollView>
        </View>
    );
}

const PropPlaceHolder = (props) => {
    const [prop, setProp] = React.useState(<AntDesign name='plus' size={24} />);

    const onSelectedProp = ({ e }) => {
        setProp(<PropGrid prop={e} />);

        if (props.onSelected != undefined) {
            props.onSelected(e);
        }
    }
    const chooseProp = () => {
        const key = RootView.add(<PropSelector attrFilter={'修行'} onSelected={onSelectedProp} onClose={() => {
            RootView.remove(key);
        }} />);
    }
    return (
        <TouchableWithoutFeedback onPress={chooseProp}>
            <View style={{ width: 45, height: 45, borderWidth: 2, borderColor: '#333', backgroundColor: '#aaa', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} pointerEvents='box-only'>
                {prop}
            </View>
        </TouchableWithoutFeedback>
    );
}

// 突破子界面
const TuPoSubPage = (props) => {
    const TUPO_CALLBACK = '__@TuPoSubPage.cb';

    const refPropSelected = React.useRef(null);
    const [propRate, setPropRate] = React.useState(0);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(TUPO_CALLBACK, (v) => {
            if (props.onClose != undefined) {
                props.onClose();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    const onTuPo = () => {
        AppDispath({ type: 'UserModel/upgradeXiuXing', payload: { prop: refPropSelected.current }, retmsg: TUPO_CALLBACK });
    }

    const onSelectedProp = (prop) => {
        refPropSelected.current = prop;
        setPropRate(prop.incSuccessRate);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 320, height: 320, backgroundColor: '#eee', borderRadius: 5 }}>
                <View style={{ alignItems: 'flex-end', marginRight: 5, marginTop: 5 }}>
                    <AntDesign name='close' size={24} onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                </View>
                <View style={{ position: 'absolute', top: 12, width: '100%', alignItems: 'center' }} pointerEvents='none'>
                    <Text style={{ fontSize: 24, color: '#000' }}>修法突破</Text>
                </View>
                <View style={{ width: '100%', marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <PropPlaceHolder onSelected={onSelectedProp} />
                    {
                    (propRate > 0)
                    ? (
                    <>
                        <View style={{ marginTop: 5 }}><Text>服用{(refPropSelected.current.name)}</Text></View>
                        <View style={{ marginTop: 20, flexDirection: 'row' }}>
                            <Text style={{ color: '#000', fontWeight: 'bold' }}>成功率:</Text>
                            <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>+{propRate}%</Text>
                        </View>
                    </>
                    )
                    : <View style={{ marginTop: 5 }}><Text>请选择突破丹</Text></View>
                    }

                </View>
                <View style={{ position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TextButton title={'再等等'} onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                    <TextButton title={'突  破'} onPress={() => onTuPo()} />
                </View>
            </View>
        </View>
    );
}

// 主界面
const XiuXingTabPage = (props) => {

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
        <Panel patternId={3}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.viewContainer}>
                    <View style={{ width: '90%', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 26, color: '#000' }}>修行</Text>
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
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <FastImage style={{ width: px2pd(607), height: px2pd(785) }} source={require('../../../assets/bg/xiuxing_bg.png')} />
                        <View style={{ position: 'absolute' }}>
                            <TextButton title={'突破'} disabled={((props.user.xiuxingStatus.value < props.user.xiuxingStatus.limit) || cdForbiden)} onPress={onTuPo} />
                        </View>
                        {
                        (cdForbiden)
                        ? (
                        <View style={{ position: 'absolute', bottom: 50 }}>
                            <Text style={{ color: '#829358', fontSize: 14, fontWeight: 'bold' }}>等待时间: {DateTime.format(props.user.xiuxingStatus.cdTime, 'yyyyMMdd hh:mm:ss')}</Text>
                        </View>
                        )
                        : <></>
                        }
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 24, color: '#000' }}>{currentXiuXingConfig.title}</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{ width: PROGRESS_BAR_WIDTH, height: 40 }}>
                            <ProgressBar value={props.user.xiuxingStatus.value} limit={props.user.xiuxingStatus.limit} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' , marginTop: 10 }}>
                        <Text style={{ fontSize: 22, color: '#000' }}>修为：</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(XiuXingTabPage);
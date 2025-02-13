import React from 'react';

import { 
    Animated, DeviceEventEmitter, TouchableWithoutFeedback,
} from 'react-native';

import {
    AppDispath,
} from "../../../constants";

import {
    View,
    Text,
} from '../../../constants/native-ui';

import lo from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';

import { TextButton } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';
import PropGrid from '../../../components/prop/PropGrid';
import RootView from '../../../components/RootView';
import PropSelector from '../../../components/prop/PropSelector';

const PropPlaceHolder = (props) => {
    const [prop, setProp] = React.useState(<AntDesign name='plus' size={24} />);

    const onSelectedProp = ({ e }) => {
        setProp(<PropGrid prop={e} showNum={false} showLabel={false} imageStyle={{ width: px2pd(110), height: px2pd(110) }} />);

        if (props.onSelected != undefined) {
            props.onSelected(e);
        }
    }
    const chooseProp = () => {
        const key = RootView.add(<PropSelector attrFilter={'突破丹'} onSelected={onSelectedProp} onClose={() => {
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

    const refSucceedVideo = React.useRef(null);
    const refFailureVideo = React.useRef(null);

    const refPropSelected = React.useRef(null);
    const refViewOpacity = React.useRef(new Animated.Value(1)).current;

    const [keyProps, setKeyProps] = React.useState([]);

    const [propRate, setPropRate] = React.useState(0);
    const [displaySucceedVideo, setDisplaySucceedVideo] = React.useState('none');
    const [displayFailureVideo, setDisplayFailureVideo] = React.useState('none');

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(TUPO_CALLBACK, (v) => {
            if (lo.isObject(v)) {
                const { success } = v;
                if (success) {
                    setDisplaySucceedVideo('flex');
                    refSucceedVideo.current.seek(0);
                } else {
                    setDisplayFailureVideo('flex');
                    refFailureVideo.current.seek(0);
                }
                refViewOpacity.setValue(0);
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        // 关键道具显示
        if (props.config.tupo.props != undefined && lo.isArray(props.config.tupo.props)) {
            const propsId = [];
            lo.forEach(props.config.tupo.props, (v, k) => {
                propsId.push(v.propId);
            });

            if (propsId.length > 0) {
                AppDispath({ type: 'PropsModel/getBagProps', payload: { propsId: propsId, always: true }, cb: (data) => {
                    if (lo.isArray(data) && data.length > 0) {
                        const list = [];
                        lo.forEach(data, (v, k) => {
                            list.push(<PropGrid prop={v} key={k} showNum={false} showLabel={true} labelStyle={{ color: '#000' }} imageStyle={{ width: px2pd(110), height: px2pd(110) }} />)
                        });
                        setKeyProps(list);
                    }
                }});
            }
        }
    }, []);

    const onTuPo = () => {
        AppDispath({ type: 'XiuXingModel/tupoXiuXing', payload: { prop: refPropSelected.current }, retmsg: TUPO_CALLBACK });
    }

    const onSelectedProp = (prop) => {
        refPropSelected.current = prop;
        setPropRate(prop.incSuccessRate);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <Video 
                style={{ position: 'absolute', width: '100%', height: '100%', display: displaySucceedVideo }}
                ref={(ref) => refSucceedVideo.current = ref}
                source={require('../../../../assets/mp4/XIUXING_TUPO.mp4')}
                fullscreen={false}
                resizeMode={'cover'}
                repeat={false}
                paused={displaySucceedVideo == 'none'}
                onEnd={() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}
            />
            <Video 
                style={{ position: 'absolute', width: '100%', height: '100%', display: displayFailureVideo }}
                ref={(ref) => refFailureVideo.current = ref}
                source={require('../../../../assets/mp4/XIUXING_TUPO_FAILURE.mp4')}
                fullscreen={false}
                resizeMode={'cover'}
                repeat={false}
                paused={displayFailureVideo == 'none'}
                onEnd={() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}
            />
            <Animated.View style={{ width: px2pd(860), height: px2pd(1100), backgroundColor: '#eee', borderRadius: 5, opacity: refViewOpacity }}>
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
                {
                (keyProps.length > 0)
                ? (
                <View style={{ width: '100%', marginTop: px2pd(60), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', left: 16, top: 0 }}>
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>关键道具:</Text>
                    </View>
                    <View style={{ width: '90%', borderWidth: 1, borderColor: '#565452', backgroundColor: '#beb9b3', borderRadius: 5, marginTop: px2pd(55), paddingTop: px2pd(25), paddingBottom: px2pd(70), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        {keyProps}
                    </View>
                </View>
                )
                : <></>
                }

                <View style={{ position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TextButton title={'再等等'} onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                    <TextButton title={'突  破'} onPress={() => onTuPo()} />
                </View>
            </Animated.View>
        </View>
    );
}

export default TuPoSubPage;

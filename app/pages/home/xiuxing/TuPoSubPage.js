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

    const refSucceedVideo = React.useRef(null);
    const refFailureVideo = React.useRef(null);

    const refPropSelected = React.useRef(null);
    const refViewOpacity = React.useRef(new Animated.Value(1)).current;

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

    const onTuPo = () => {
        AppDispath({ type: 'UserModel/upgradeXiuXing', payload: { prop: refPropSelected.current }, retmsg: TUPO_CALLBACK });
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
                source={require('../../../../assets/mp4/XIUXING_TUPO.mp4')}
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
            <Animated.View style={{ width: 320, height: 320, backgroundColor: '#eee', borderRadius: 5, opacity: refViewOpacity }}>
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
            </Animated.View>
        </View>
    );
}

export default TuPoSubPage;

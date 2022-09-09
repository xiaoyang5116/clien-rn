import React from 'react';

import {
    View,
    Text,
} from '../../../constants/native-ui';

import { 
    Animated,
    DeviceEventEmitter,
    SafeAreaView,
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../../constants/custom-ui';
import PropGrid from '../../../components/prop/PropGrid';
import { AppDispath } from '../../../constants';
import { connect } from 'react-redux';
import { px2pd } from '../../../constants/resolution';

const UpgradeConfirm = (props) => {

    const MSG_ID_GET_BAG_PROP = '__@UpgradeConfirm.getBagProp';
    const scale = React.useRef(new Animated.Value(0)).current;
    const [prop, setProp] = React.useState(null);

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    let currentItem = null;
    for (let key in props.value) {
        const item = props.value[key];
        if (item.finished == undefined) {
            currentItem = item;
            break;
        }
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(MSG_ID_GET_BAG_PROP, (v) => {
            setProp(v);
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        AppDispath({ type: 'PropsModel/getBagProp', payload: { propId: currentItem.propId, always: true }, retmsg: MSG_ID_GET_BAG_PROP });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[{ width: 300, height: 370, backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <View style={{ width: '94%', marginTop: 10, marginBottom: 15, backgroundColor: '#ccc', borderWidth: 1, borderColor: '#333', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, lineHeight: 40 }}>{props.data.name}</Text>
                    </View>
                    <View style={{ width: '94%', height: 240, marginBottom: 15, borderWidth: 1, borderColor: '#333', borderRadius: 5 }}>
                        <View style={{ width: '100%', height: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>升级收藏品，获得更好的属性</Text>
                        </View>
                        <View style={{ width: '100%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 60, height: 60, borderWidth: 1, borderColor: '#333', borderRadius: 5, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                                {(prop != null) ? <PropGrid prop={prop} showNum={true} showLabel={false} labelStyle={{ color: '#000' }} /> : <></>}
                            </View>
                            <View style={{ marginTop: px2pd(40) }}>
                                <Text>所需道具: {(prop != null) ? prop.name : ''} x {currentItem.num}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '94%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'改良'} disabled={!(prop != null && prop.num >= currentItem.num)} onPress={() => {
                            AppDispath({ type: 'CollectionModel/upgrade', payload: { id: props.data.id }, retmsg: '__@UpgradeSubPage.completed' });
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                        <TextButton title={'取消'} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

export default connect((state) => ({ user: { ...state.UserModel } }))(UpgradeConfirm);
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
import { AppDispath } from '../../../constants';
import Toast from '../../../components/toast';
import { connect } from 'react-redux';

const ActivationConfirm = (props) => {

    const CALLBACK_EVENT_KEY = '__@ActivationConfirm.activate';

    const scale = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(CALLBACK_EVENT_KEY, (v) => {
            if (!v) {
                Toast.show('激活失败!');
                return
            }
            Toast.show('激活成功!');

            DeviceEventEmitter.emit('__@CollectionTabPage.refresh');
            if (props.onClose != undefined) {
                props.onClose();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    // 激活所需物品
    const upgradeItem = props.data.upgrade[0];

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[{ width: 300, height: 370, backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <View style={{ width: '94%', marginTop: 10, marginBottom: 15, backgroundColor: '#ccc', borderWidth: 1, borderColor: '#333', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, lineHeight: 40 }}>{props.data.name}</Text>
                    </View>
                    <View style={{ width: '94%', height: 240, marginBottom: 15, borderWidth: 1, borderColor: '#333', borderRadius: 5 }}>
                        <View style={{ width: '100%', height: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>是否激活收藏品，获得属性效果？</Text>
                        </View>
                        <View style={{ width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderWidth: 1, borderColor: '#333', borderRadius: 5, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>铜币</Text>
                                <Text style={{ position: 'absolute', bottom: -20 }}>{upgradeItem.copper}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '94%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'确认'} disabled={(props.user.copper < upgradeItem.copper)} onPress={() => {
                            AppDispath({ type: 'CollectionModel/activate', payload: { id: props.data.id }, retmsg: CALLBACK_EVENT_KEY});
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

export default connect((state) => ({ user: { ...state.UserModel } }))(ActivationConfirm);
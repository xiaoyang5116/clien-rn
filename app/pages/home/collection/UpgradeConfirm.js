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

const UpgradeConfirm = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
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
                        <View style={{ width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50, borderWidth: 1, borderColor: '#333', borderRadius: 5, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                                <PropGrid prop={{ id: 3001, iconId: 1, quality: 2, num: 5, name: 'xxx' }} labelStyle={{ color: '#000' }} />
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '94%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'改良'} disabled={false} onPress={() => {
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
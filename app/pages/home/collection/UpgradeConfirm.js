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
import { getAttributeChineseName } from '../../../utils/AttributeUtils';

const UpgradeConfirm = (props) => {

    const MSG_ID_GET_BAG_PROPS = '__@UpgradeConfirm.getBagProp';
    const scale = React.useRef(new Animated.Value(0)).current;
    const [prop, setProp] = React.useState(null);
    const [items, setItems] = React.useState(null);

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
        const listener = DeviceEventEmitter.addListener(MSG_ID_GET_BAG_PROPS, (v) => {
            setItems(v);
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const propsId = [];
        if (lo.isArray(currentItem.props)) {
            lo.forEach(currentItem.props, (v, k) => {
                if (v.propId != undefined) propsId.push(v.propId);
            });
        }
        AppDispath({ type: 'PropsModel/getBagProps', payload: { propsId: propsId, always: true }, retmsg: MSG_ID_GET_BAG_PROPS });
    }, []);

    let canUpgrade = true;
    const requirePropsTxt = [];
    const requirePropsGrid = [];
    if (items != null && currentItem != null) {
        lo.forEach(currentItem.props, (v, k) => {
            const prop = lo.find(items, (e) => e.id == v.propId);
            requirePropsTxt.push(<Text key={k} style={{ color: '#333', lineHeight: 24 }}>{prop.name} * {v.num}</Text>);
            requirePropsGrid.push(<View key={k} style={{ margin: 5 }}><PropGrid prop={prop} showNum={true} showLabel={false} labelStyle={{ color: '#000' }} /></View>);
            if (v.num > prop.num) canUpgrade = false;
        });
    }

    const attrs = [];
    lo.forEach(props.data.attrs, (v, k) => {
        const found = lo.find(currentItem.attrs, (e) => lo.isEqual(e.key, v.key));
        const attrName = getAttributeChineseName(v.key);
        attrs.push(<View key={k} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: (found != undefined) ? '#669900' : '#333', lineHeight: 26 }}>{attrName}: {v.value}</Text>
            {(found != undefined) ? <Text style={{ color: '#669900' }}> +{found.value}</Text> : <></>}
        </View>);
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[{ width: 300, backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <View style={{ width: '94%', marginTop: 10, marginBottom: 15, backgroundColor: '#ccc', borderWidth: 1, borderColor: '#333', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, lineHeight: 40 }}>{props.data.name}</Text>
                    </View>
                    <View style={{ width: '94%', marginBottom: 15, borderWidth: 1, borderColor: '#333', borderRadius: 5 }}>
                        <View style={{ width: '100%', marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontWeight: 'bold' }}>升级收藏品，获得更好的属性</Text>
                            <View>
                                {attrs}
                            </View>
                        </View>
                        <View style={{ width: '100%', marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: '90%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                {requirePropsGrid}
                            </View>
                            <View style={{ marginTop: px2pd(40), marginBottom: px2pd(20) }}>
                                <Text style={{ color: '#000', fontWeight: 'bold', lineHeight: 24 }}>所需道具: </Text>
                                {requirePropsTxt}
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '94%', marginBottom: px2pd(30), flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'改良'} disabled={!canUpgrade} onPress={() => {
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
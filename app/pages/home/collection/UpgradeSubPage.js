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
import Toast from '../../../components/toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import RootView from '../../../components/RootView';
import UpgradeConfirm from './UpgradeConfirm';

const ItemProgress = (props) => {
    return (
        <View style={{ width: 30, height: 100, backgroundColor: '#ccc', overflow: 'hidden', borderRadius: 5 }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#669900', transform: [{ translateY: ((1 - props.percent / 100) * 100) }] }} />
        </View>
    );
}

const SubItem = (props) => {

    const onUpgrade = () => {
        const key = RootView.add(<UpgradeConfirm value={props.value} data={props.data} onClose={() => {
            RootView.remove(key);
        }} />);
    }

    let finishedNum = 0;
    lo.forEach(props.value, (v, k) => {
        if (v.finished != undefined && lo.isBoolean(v.finished) && v.finished) {
            finishedNum += 1;
        }
    });

    let showButton = false;
    if (lo.find(props.value, (v, k) => (v.finished == undefined || (lo.isBoolean(v.finished) && !v.finished))) != undefined) {
        const upgradeItems = props.data.upgrade[props.data.level-1].items;
        const previous = upgradeItems[props.index - 1];
        if (previous == undefined || previous == null || lo.find(previous, (v, k) => v.finished == undefined) == undefined) {
            showButton = true;
        }
    }

    return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ItemProgress percent={finishedNum/props.value.length * 100} />
        <Text style={{ color: '#000', marginTop: 5 }}>{finishedNum}/{props.value.length}</Text>
        <View style={{ height: 30 }}>
            {(showButton) ? <AntDesign name='pluscircleo' color={'#666'} size={24} style={{ marginTop: 5 }} onPress={onUpgrade} /> : <></>}
        </View>
    </View>
    );
}

const UpgradeSubPage = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;
    const [data, setData] = React.useState(props.data);

    React.useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@UpgradeSubPage.completed', (v) => {
            if (lo.isBoolean(v) && !v)
                return
            //
            setData(lo.cloneDeep(v));
            //
            if (v.__full != undefined && lo.isBoolean(v.__full) && v.__full) {
                Toast.show('升星突破!');
                DeviceEventEmitter.emit('__@CollectionTabPage.refresh');

                setTimeout(() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }, 1000);
            } else {
                Toast.show('改良成功!');
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    const subItemViews = [];
    const upgradeItems = data.upgrade[data.level-1].items;
    lo.forEach(upgradeItems, (v, k) => {
        subItemViews.push(<SubItem key={k} index={k} value={v} data={data} />);
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[{ width: 300, height: 370, backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <View style={{ width: '94%', marginTop: 10, marginBottom: 15, backgroundColor: '#ccc', borderWidth: 1, borderColor: '#333', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, lineHeight: 40 }}>{data.name} ({data.level}星)</Text>
                    </View>
                    <View style={{ width: '94%', height: 240, marginBottom: 15, borderWidth: 1, borderColor: '#333', borderRadius: 5, alignItems: 'center' }}>
                        <View style={{ width: '100%', height: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>改良收藏品，获得更好的属性效果</Text>
                        </View>
                        <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            {subItemViews}
                        </View>
                    </View>
                    <View style={{ width: '94%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'返回'} onPress={() => {
                            DeviceEventEmitter.emit('__@CollectionTabPage.refresh');
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

export default connect((state) => ({ user: { ...state.UserModel } }))(UpgradeSubPage);
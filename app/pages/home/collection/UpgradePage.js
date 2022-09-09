import React from 'react';

import {
    View,
    Text,
} from '../../../constants/native-ui';

import { 
    Animated,
    SafeAreaView,
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { px2pd } from '../../../constants/resolution';
import { TextButton } from '../../../constants/custom-ui';
import RootView from '../../../components/RootView';
import StarsBanner from './StarsBanner';
import UpgradeSubPage from './UpgradeSubPage';

const UpgradePage = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;

    const attrs = [];
    lo.forEach(props.data.attrs[props.data.level], (v, k) => {
        attrs.push(<Text key={k} style={{ color: '#000', lineHeight: 26 }}>{v.key}: +{v.value}</Text>);
    });

    const attrsFull = [];
    if (attrs.length == 0) {
        lo.forEach(props.data.attrs[props.data.stars-1], (v, k) => {
            attrsFull.push(<Text key={k} style={{ color: '#000', lineHeight: 26 }}>{v.key}: +{v.value}</Text>);
        });
    }

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
                <Animated.View style={[{ width: px2pd(800), height: px2pd(1050), backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <View style={{ width: '100%', alignItems: 'flex-end' }}>
                        <AntDesign name='close' size={30} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                    <View style={{ width: '94%' }}>
                        <View style={{ marginBottom: 20, width: px2pd(260), height: px2pd(300), justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', backgroundColor: '#aaa', borderRadius: 5, }}>
                            <View style={{ width: px2pd(220), height: px2pd(260), borderWidth: 1, borderColor: '#333', backgroundColor: '#ccc', borderRadius: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <FastImage style={{ marginLeft: 3, width: px2pd(200), height: px2pd(200) }} source={require('../../../../assets/collection/item_1.png')} />
                                <StarsBanner max={props.data.stars} star={(props.data.level != undefined && props.data.level >= 0) ? props.data.level : 0} />
                            </View>
                        </View>
                        <View style={{ position: 'absolute', right: 60 }}>
                            <Text style={{ fontSize: 24, color: '#000' }}>{props.data.name}</Text>
                        </View>
                    </View>
                    <View style={{ width: '94%', height: 140, marginBottom: 20, borderWidth: 1, borderColor: '#333', borderRadius: 5, backgroundColor: '#ccc', padding: 5}}>
                        { (attrs.length > 0) ? attrs : attrsFull }
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {
                        (attrs.length > 0)
                        ? (
                        <TextButton style={{ width: px2pd(300) }} title={'改良'} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                            setTimeout(() => {
                                const key = RootView.add(<UpgradeSubPage data={props.data} onClose={() => {
                                    RootView.remove(key);
                                }} />);
                            }, 200);
                        }} />
                        )
                        : <Text style={{ color: '#000' }}>已满级</Text>
                        }

                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

export default UpgradePage;
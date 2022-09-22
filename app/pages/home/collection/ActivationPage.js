import React from 'react';

import {
    View,
    Text,
} from '../../../constants/native-ui';

import { 
    Animated,
    SafeAreaView,
} from 'react-native';

import { BlurView } from "@react-native-community/blur";

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { px2pd } from '../../../constants/resolution';
import { TextButton } from '../../../constants/custom-ui';
import RootView from '../../../components/RootView';
import StarsBanner from './StarsBanner';
import ActivationConfirm from './ActivationConfirm';
import * as Animatable from 'react-native-animatable';

const ActivationPage = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;
    const refView = React.createRef();

    const attrs = [];
    lo.forEach(props.data.attrs, (v, k) => {
        attrs.push(<Text key={k} style={{ color: '#000', lineHeight: 26 }}>{v.key}: +{v.value}</Text>);
    });

    React.useEffect(() => {
        refView.current.zoomIn();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <BlurView
                style = {{ position: 'absolute', width: '100%', height: '100%' }}
                blurType = "dark"
                blurAmount = {10}
                reducedTransparencyFallbackColor="white">
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animatable.View ref={refView} duration={600} style={[{ width: px2pd(800), height: px2pd(1050), backgroundColor: '#eee', alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
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
                            <Text style={{ color: '#ce6a6f', lineHeight: 26 }}>激活后，获得以下属性效果</Text>
                            {attrs}
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TextButton style={{ width: px2pd(300) }} title={'激活'} onPress={() => {
                                if (props.onClose != undefined) {
                                    props.onClose();
                                }
                                setTimeout(() => {
                                    const key = RootView.add(<ActivationConfirm data={props.data} onClose={() => {
                                        RootView.remove(key);
                                    }} />);
                                }, 200);
                            }} />
                        </View>
                    </Animatable.View>
                </SafeAreaView>
            </BlurView>
        </View>
    );
}

export default ActivationPage;
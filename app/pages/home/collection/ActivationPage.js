import React from 'react';

import {
    View,
    Text,
} from '../../../constants/native-ui';

import {
    Animated,
    SafeAreaView,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { px2pd } from '../../../constants/resolution';
import { TextButton } from '../../../constants/custom-ui';
import RootView from '../../../components/RootView';
import DarkBlurView from '../../../components/extends/DarkBlurView';
import StarsBanner from './StarsBanner';
import ActivationConfirm from './ActivationConfirm';
import { getAttributeChineseName } from '../../../utils/AttributeUtils';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ActivationPage = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;
    const refView = React.createRef();

    const attrs = [];
    lo.forEach(props.data.attrs, (v, k) => {
        const attrName = getAttributeChineseName(v.key);
        attrs.push(<Text key={k} style={{ color: '#000', lineHeight: 26 }}>{attrName}: +{v.value}</Text>);
    });

    React.useEffect(() => {
        refView.current.zoomIn();
    }, []);

    return (
        <DarkBlurView>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animatable.View ref={refView} duration={600} style={[{ width: px2pd(800), height: px2pd(1050), alignItems: 'center', borderRadius: 5 }, { transform: [{ scale: scale }] }]}>
                    <FastImage style={{ width: "100%", height: "100%", position: 'absolute' }} source={require('../../../../assets/collection/activationPage_bg.png')} />
                    <View style={{ width: '100%', alignItems: 'flex-end' }}>
                        <TouchableWithoutFeedback onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }}>
                            <FastImage style={{ width: px2pd(60), height: px2pd(60), marginRight: 12, marginTop: 12 }} source={require('../../../../assets/collection/close.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ width: px2pd(720) }}>
                        <ImageBackground
                            source={require('../../../../assets/collection/cover_bg.png')}
                            style={{ marginBottom: 20, width: px2pd(260), height: px2pd(300), justifyContent: 'center', alignItems: 'center', }}
                        >
                            <View style={{ width: px2pd(220), height: px2pd(260), flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <FastImage style={{ marginLeft: 3, width: px2pd(200), height: px2pd(200) }} source={require('../../../../assets/collection/item_1.png')} />
                                <StarsBanner max={props.data.stars} star={(props.data.level != undefined && props.data.level >= 0) ? props.data.level : 0} />
                            </View>
                        </ImageBackground>
                        <View style={{ position: 'absolute', right: 70, flexDirection: "row", alignItems: 'center' }}>
                            <FastImage style={{ width: px2pd(30), height: px2pd(30) }} source={require('../../../../assets/collection/lingxing.png')} />
                            <Text style={{ fontSize: 24, color: '#000', marginLeft: 4 }}>{props.data.name}</Text>
                        </View>
                    </View>
                    <ImageBackground
                        source={require('../../../../assets/collection/desc_bg.png')}
                        style={{ width: px2pd(720), height: px2pd(440), marginBottom: 10, padding: 12 }}>
                        <Text style={{ color: '#000', lineHeight: 26 }}>激活后，获得以下属性效果</Text>
                        {attrs}
                    </ImageBackground>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                            setTimeout(() => {
                                const key = RootView.add(<ActivationConfirm data={props.data} onClose={() => {
                                    RootView.remove(key);
                                }} />);
                            }, 200);
                        }}>
                            <ImageBackground
                                style={{ width: px2pd(300), height: px2pd(100), justifyContent: "center", alignItems: 'center' }}
                                source={require('../../../../assets/collection/btn_bg.png')}>
                                <Text style={{ fontSize: 16, color: "#000" }}>激活</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        {/* <TextButton style={{ width: px2pd(300) }} title={'激活'}  /> */}
                    </View>
                </Animatable.View>
            </SafeAreaView>
        </DarkBlurView>
    );
}

export default ActivationPage;
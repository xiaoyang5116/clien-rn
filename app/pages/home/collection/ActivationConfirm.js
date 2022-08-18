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
import { TextButton } from '../../../constants/custom-ui';

const ActivationConfirm = (props) => {

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

                    </View>
                    <View style={{ width: '94%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TextButton title={'确认'} onPress={() => {
                            console.debug(props.data);
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

export default ActivationConfirm;
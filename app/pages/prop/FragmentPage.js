import React from 'react';

import { 
    SafeAreaView,
    View,
    Text,
} from '../../constants/native-ui';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { Animated, StyleSheet, Easing } from 'react-native';
import PropGrid from '../../components/prop/PropGrid';
import { TextButton } from '../../constants/custom-ui';

const FragmentPage = (props) => {

    const scale = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {

        Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={[styles.viewContainer, { transform: [{ scale: scale }] }]}>
                    <View style={{ position: 'absolute', right: 5, top: 5 }}>
                        <AntDesign name='close' size={28} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                    <View style={{ height: 40, marginBottom: 15, justifyContent: 'center', alignItems: 'center' }} pointerEvents='none'>
                        <Text style={{ fontSize: 24 }}>碎片合成</Text>
                    </View>
                    <View style={{ margin: 8, paddingTop: 10, paddingBottom: 20, backgroundColor: '#dee0e0', borderWidth: 3, borderColor: '#c2c4c4', borderRadius: 10 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{props.toPropConfig.name}, 你已拥有足够碎片！</Text>
                            <Text>(当前碎片 {props.fragment.num}/{props.fragment.composite.requireNum})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                        <PropGrid showNum={false} prop={props.fragment} labelStyle={{ color: '#000' }} />
                        <AntDesign name='doubleright' size={28} style={{ marginLeft: 10, marginTop: 8, marginRight: 10 }} />
                        <PropGrid showNum={false} prop={props.toPropConfig} labelStyle={{ color: '#000' }} />
                        </View>
                    </View>
                    <View style={{ marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                        <TextButton title={'确认'} style={{ width: 200 }} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        width: 330, 
        height: 280, 
        borderWidth: 1, 
        borderColor: '#333', 
        borderRadius: 5, 
        backgroundColor: '#eee',
    },
});

export default FragmentPage;
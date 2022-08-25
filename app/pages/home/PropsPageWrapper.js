import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import PropsPage from './PropsPage';
import { SafeAreaView, Text, View } from 'react-native';
import { Panel } from '../../components/panel';

const PropsPageWrapper = (props) => {
    return (
        <Panel patternId={2}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', left: 10 }}>
                        <AntDesign name='left' color={'#333'} size={28} onPress={() => {
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                    <Text style={{ fontSize: 26, color: '#000' }}>道具</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <PropsPage />
                </View> 
            </SafeAreaView>
        </Panel>
    );
}

export default PropsPageWrapper;
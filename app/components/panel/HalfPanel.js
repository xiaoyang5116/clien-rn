import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';

export const HalfPanel = props => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        margin: 10,
                        width: '90%',
                        height: '75%',
                        borderRadius: props.borderRadius ? props.borderRadius : 10,
                        overflow: 'hidden',
                    }}>
                    {props.children}
                </View>
            </View>
        </SafeAreaView>
    );
};

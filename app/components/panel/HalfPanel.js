import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';

export const HalfPanel = props => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: props.backgroundColor ? props.backgroundColor : null, }}>
                <View
                    style={{
                        margin: 10,
                        width: props.width ? props.width : '90%',
                        height: props.height ? props.height : '80%',
                        borderRadius: props.borderRadius ? props.borderRadius : 10,
                        overflow: 'hidden',
                    }}>
                    {props.children}
                </View>
            </View>
        </SafeAreaView>
    );
};

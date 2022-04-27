import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

export const HalfPanel = (props) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ margin: 10, padding: 5, width: '90%', height: '75%', backgroundColor: '#fff' }}>
                    {props.children}
                </View>
            </View>
        </SafeAreaView>
    )
}

import { View, Text, SafeAreaView, ImageBackground, Image } from 'react-native';
import React from 'react';
import { px2pd } from '../../constants/resolution';

export const HalfPanel = props => {
    const { source } = props

    if (source !== undefined) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: props.backgroundColor ? props.backgroundColor : null, }}>
                    <View
                        style={{
                            width: props.width ? props.width : '90%',
                            height: props.height ? props.height : '80%',
                            borderRadius: props.borderRadius ? props.borderRadius : 0,
                            overflow: 'hidden',
                            ...props.style
                        }}>
                        <Image style={{ width: "100%", height: "100%", position: "absolute", zIndex: 0, }} source={source} />
                        {props.children}
                    </View>
                </View>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: props.backgroundColor ? props.backgroundColor : null, }}>
                <View
                    style={{
                        width: props.width ? props.width : '90%',
                        height: props.height ? props.height : '80%',
                        borderRadius: props.borderRadius ? props.borderRadius : 10,
                        overflow: 'hidden',
                        ...props.style
                    }}>
                    {props.children}
                </View>
            </View>
        </SafeAreaView>
    );
};

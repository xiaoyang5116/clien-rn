import React from 'react'
import { View, Text, ImageBackground, Image, Animated, TouchableOpacity, Button } from 'react-native';

export default function GameOverModal(props) {
    return (
        <View style={props.style.GameOverModal}>
            <View style={props.style.GameOverModalContent}>
                <Text style={props.style.GameOverModalContent_Text}>结局{props.name}饿死了</Text>
                <Text style={props.style.GameOverModalContent_Text}>你还是饿死了</Text>
            </View>
            <View style={props.style.GameOverModalButtonContainer}>
                <Button style={props.style.GameOverModalButtonContainer_Button} title='返回' onPress={props.back} />
            </View>
        </View>
    )
}

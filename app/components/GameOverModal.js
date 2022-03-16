import React from 'react'
import { View, Text, ImageBackground, Image, Animated, TouchableOpacity, Button } from 'react-native';
import * as RootNavigation from '../utils/RootNavigation';

// import {
//     action,
//     connect,
// } from "../constants";

export default function GameOverModal(props) {
    const { currentStyles, title, content } = props
    return (
        <View style={currentStyles.GameOverModal}>
            <View style={currentStyles.GameOverModalContent}>
                <Text style={currentStyles.GameOverModalContent_Text}>结局{title}饿死了</Text>
                <Text style={currentStyles.GameOverModalContent_Text}>{content}</Text>
            </View>
            <View style={currentStyles.GameOverModalButtonContainer}>
                <Button style={currentStyles.GameOverModalButtonContainer_Button} title='返回'
                    onPress={() => {

                        props.onDialogCancel();
                        // RootNavigation.navigate('First');
                    }}
                />
            </View>
        </View>
    )
}
// export default connect((state) => ({ ...state.MaskModel, ...state.AppModel }))(GameOverModal)

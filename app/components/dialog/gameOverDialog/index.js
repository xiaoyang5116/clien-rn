import { View, Text } from 'react-native'
import React from 'react'

// import * as RootNavigation from '../../utils/RootNavigation';

import {
    action,
    connect,
    ThemeContext
} from "../../../constants";

export default function GameOverDialog(props) {
    const theme = React.useContext(ThemeContext);
    const { title, content } = props
    return (
        <View style={theme.GameOverModal}>
            <View style={theme.GameOverModalContent}>
                <Text style={theme.GameOverModalContent_Text}>{title}</Text>
                <View>

                </View>
            </View>
            <View style={theme.GameOverModalButtonContainer}>
                <Button style={theme.GameOverModalButtonContainer_Button} title='返回'
                    onPress={() => {
                        props.onDialogCancel();
                        // RootNavigation.navigate('First');
                    }}
                />
            </View>
        </View>
    )
}

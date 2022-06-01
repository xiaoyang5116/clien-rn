import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import {
    connect,
    ThemeContext,
} from "../../../constants";

const TButton = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={[theme.readerSettingRow_box]}
            onPress={props.onPress}
        >
            <Text style={[
                theme.readerSetting_border_1,
                {
                    borderColor: props.selected ? readerStyle.selectedBorderColor : readerStyle.borderColor,
                    opacity: props.disabled ? 0.4 : 1,
                    color: readerStyle.color,
                    backgroundColor: props.bg ? props.bg : null,
                }
            ]}>
                {props.title}
            </Text>
        </TouchableOpacity>

    )
}

export default connect(state => ({ ...state.ArticleModel }))(TButton);

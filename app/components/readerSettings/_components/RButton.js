import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import {
    connect,
    ThemeContext,
} from "../../../constants";


const RButton = (props) => {
    const theme = React.useContext(ThemeContext);
    const { readerStyle } = props
    return (
        <TouchableOpacity
            disabled={props.selected}
            style={[theme.readerSettingRow_box]}
            onPress={props.onPress}
        >
            <Text style={[
                theme.readerSetting_border_2,
                {
                    // opacity: props.disabled ? 0.4 : 1,
                    borderColor: props.selected ? readerStyle.selectedBorderColor : readerStyle.borderColor,
                    backgroundColor: props.color,
                    overflow: 'hidden',
                    color: readerStyle.color,
                }
            ]}>
                {props.title}
            </Text>
        </TouchableOpacity>

    )
}

export default connect(state => ({ ...state.ArticleModel }))(RButton);
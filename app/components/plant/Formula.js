import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import RootView from '../RootView'
import { HalfPanel } from '../panel/HalfPanel'
import { TextButton } from '../../constants/custom-ui'

const FormulaComponent = (props) => {
    return (
        <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <Text style={{ height: 50, lineHeight: 50, textAlign: "center", fontSize: 24, color: "#000", backgroundColor: "#ccc" }}>请选择配方</Text>
                <View style={{ flex: 1 }}></View>
                <View style={{}}>
                    <TextButton
                        title={"退出"}
                        onPress={() => { props.onClose() }}
                    />
                </View>
            </View>
        </HalfPanel>
    )
}

export default FormulaComponent

export class Formula {
    static show() {
        const key = RootView.add(
            <FormulaComponent onClose={() => { RootView.remove(key) }} />
        )
    }
}
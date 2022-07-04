import { View, Text, FlatList } from 'react-native'
import React from 'react'

const DATA = [
    {
        id: 1,
    },
    {
        id: 2,
    },
]

const Farm = (props) => {

    const Grade = (props) => {
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "center", fontSize: 20, backgroundColor: "#2ecc71" }}>120</Text>
                <View style={{ flex: 1 }}></View>
            </View>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <View style={{ height: 200, width: "100%", marginTop: 24, flexDirection: "row" }}>
                <View style={{ width: 50, }}>
                    <Grade />
                </View>
                <View style={{ flex: 1, backgroundColor: "green" }}>

                </View>
                <View style={{ width: 70, backgroundColor: "blue" }}>

                </View>
            </View>
        )
    }
    return (
        <FlatList
            data={DATA}
            renderItem={renderItem}
        />
    )
}

export default Farm
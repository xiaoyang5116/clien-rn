import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

import { action, connect, EventKeys } from "../../constants"

import { HalfPanel } from '../panel/HalfPanel'
import { TextButton } from '../../constants/custom-ui'

const Improve = (props) => {
    const { lingTianName, lingTianId } = props

    const [propsData, setPropsData] = useState([])

    useEffect(() => {
        props.dispatch(action("PlantModel/getProps")({ type: 101 })).then(data => {
            setPropsData(data)
        })
    }, [])

    const changeLingQiZhi = (plantLingQiZhi) => {
        props.dispatch(action("PlantModel/changeLingQiZhi")({ lingTianName, lingTianId, lingQiZhi: plantLingQiZhi })).then(r => {
            props.onClose()
        })

    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.props_container}>
                <Text>{item.name}</Text>
                <Text>{item.desc}</Text>
                {/* <Text>剩余:{item.num}</Text> */}
                <TextButton title={"使用"} onPress={() => { changeLingQiZhi(item.plantLingQiZhi) }} />
            </View>
        )
    }
    return (
        <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <Text style={{ fontSize: 20, color: "#000", textAlign: 'center', marginTop: 12 }}>选择道具</Text>
                <View>
                    <FlatList
                        data={propsData}
                        renderItem={renderItem}
                    // keyExtractor={item => item.id}
                    />
                </View>

            </View>
        </HalfPanel>
    )
}

export default connect((state) => ({ ...state.PlantModel, ...state.PropsModel }))(Improve)

const styles = StyleSheet.create({
    props_container: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 12,
    }
})
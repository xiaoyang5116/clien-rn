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

const Accelerate = (props) => {
    const { lingTianName, lingTianId } = props

    const [propsData, setPropsData] = useState([])

    useEffect(() => {
        props.dispatch(action("PlantModel/getProps")({ type: 100 })).then(data => {
            setPropsData(data)
        })
    }, [])

    const renderItem = ({ item }) => {
        const changeLingQiZhi = () => {
            props.dispatch(action("PlantModel/acceleratePlantTime")({ lingTianName, lingTianId, plantTime: item.plantTime, propsId: item.id })).then(r => {
                props.onClose()
            })
        }

        return (
            <View style={styles.props_container}>
                <Text>{item.name}</Text>
                <Text>{item.desc}</Text>
                {/* <Text>剩余:{item.num}</Text> */}
                <TextButton title={"使用"} onPress={changeLingQiZhi} />
            </View>
        )
    }

    return (
        <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <Text style={{ fontSize: 20, color: "#000", textAlign: 'center', marginTop: 12 }}>选择加速道具</Text>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={propsData}
                        renderItem={renderItem}
                    />
                </View>
                <TextButton title={"退出"} onPress={props.onClose} />

            </View>
        </HalfPanel>
    )
}

export default connect((state) => ({ ...state.PropsModel }))(Accelerate)

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
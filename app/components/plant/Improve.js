import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Image
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

import { action, connect, EventKeys } from "../../constants"
import { px2pd } from '../../constants/resolution';

import { HalfPanel } from '../panel/HalfPanel'
import { TextButton } from '../../constants/custom-ui'
import ImageCapInset from 'react-native-image-capinsets-next';

const Improve = (props) => {
    const { lingTianName, lingTianId } = props

    const [propsData, setPropsData] = useState([])

    useEffect(() => {
        props.dispatch(action("PlantModel/getProps")({ type: 101 })).then(data => {
            setPropsData(data)
        })
    }, [])

    const renderItem = ({ item }) => {
        const changeLingQiZhi = () => {
            props.dispatch(action("PlantModel/changeLingQiZhi")({ lingTianName, lingTianId, lingQiZhi: item.plantLingQiZhi, propsId: item.id })).then(r => {
                props.onClose()
            })
        }

        return (
            <View style={{ borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi_gray.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                />
                <View style={styles.props_container}>
                    <Text>{item.name}</Text>
                    <Text>{item.desc}</Text>
                    {/* <Text>剩余:{item.num}</Text> */}
                    <TextButton title={"使用"} onPress={changeLingQiZhi} />
                </View>
            </View>
        )
    }

    return (
        <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
            <Image style={{ position: "absolute", width: "100%", height: "100%" }} source={require('../../../assets/plant/plantBg.jpg')} />
            <View style={{ flex: 1, }}>
                <Text style={{ fontSize: 20, color: "#ccc", textAlign: 'center', marginTop: 12, }}>选择改良道具</Text>
                <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, }}>
                    <FlatList
                        data={propsData}
                        renderItem={renderItem}
                    />
                </View>
                <View style={{ marginBottom: 12, width: "100%", paddingLeft: 12, paddingRight: 12, }}>
                    <TextButton title={"退出"} onPress={props.onClose} />
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    }
})
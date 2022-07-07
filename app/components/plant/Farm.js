import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

import { action, connect } from "../../constants"
import RootView from '../RootView';

import Formula from './Formula'



// status: 0--待种植, 1--种植中, 2--成熟, 3--未开辟
// const DATA = [
//     {
//         id: 1,  // id
//         status: 1,  // 状态
//         lingqizhi: 1000,  //灵气值
//         lingwu: 1,  // 灵物
//         soil: 1,  // 土壤
//         zhenfa: 1,  //阵法
//     },
//     {
//         id: 2,  // id
//         status: 1,  // 状态
//         lingqizhi: 1000,  //灵气值
//         lingwu: 1,  // 灵物
//         soil: 1,  // 土壤
//         zhenfa: 1,  //阵法
//     },
//     {
//         id: 3,  // id
//         status: 1,  // 状态
//         lingqizhi: 1000,  //灵气值
//         lingwu: 1,  // 灵物
//         soil: 1,  // 土壤
//         zhenfa: 1,  //阵法
//     },
//     {
//         id: 4,  // id
//         status: 1,  // 状态
//         lingqizhi: 1000,  //灵气值
//         lingwu: 1,  // 灵物
//         soil: 1,  // 土壤
//         zhenfa: 1,  //阵法
//     },
// ]

const Farm = (props) => {

    const { lingTianData, lingTianName } = props

    let DATA = []
    if (lingTianData.length > 0) {
        DATA = lingTianData.find(item => item.name === lingTianName).lingTian
    }

    useEffect(() => {
        if (lingTianData.length === 0) {
            props.dispatch(action('PlantModel/getLingTianData')())
        }
    }, [])





    const Grade = (item) => {
        const container_height = 180  // 容器显示的高度
        const lingQiZhi = item.lingQiZhi // 有多少灵气
        const lingQiZhi_online = 1000  // 灵气槽的容量
        const proportion = container_height / lingQiZhi_online  // 相对于容器高度的比例
        const lingQiZhi_height = container_height - (lingQiZhi * proportion)  // 灵气值显示高度 :180 - 18 =162
        const translateY = useRef(new Animated.Value(lingQiZhi_height)).current;

        return (
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: "#2ecc71", height: 20, lineHeight: 20 }}>{item.grade}</Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={{ height: container_height, width: 20, backgroundColor: "#135200", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                        <Animated.View style={{ width: 20, backgroundColor: "#4f6f46", height: container_height, position: "absolute", transform: [{ translateY }] }}></Animated.View>
                        <Text style={{ width: 10, textAlign: "center" }}>{lingQiZhi}/1000</Text>
                    </View>
                </View>
            </View>
        )
    }

    const Plant = (item) => {
        const showFormula = () => {
            props.dispatch(action("PlantModel/selectedLingTian")({lingTianName,lingTianId:item.id}))
            const key = RootView.add(<Formula onClose={() => { RootView.remove(key); }} />);
        }

        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={showFormula}>
                <View style={{ flex: 1 }}>
                    <Text style={{ width: 150, height: 30, lineHeight: 30, fontSize: 20, textAlign: "center", backgroundColor: "#389e0d" }}>
                        待种植
                    </Text>
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, backgroundColor: "#389e0d" }}>
                        <Text>进度条</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const Equipment = (item) => {
        return (
            <View style={{ flex: 1, justifyContent: "space-evenly", alignItems: "flex-end" }}>
                <Text style={styles.equipment_btn}>灵物</Text>
                <Text style={styles.equipment_btn}>土壤</Text>
                <Text style={styles.equipment_btn}>阵法</Text>
            </View>

        )
    }

    const FunctionKeys = (item) => {
        return (
            <View style={{ height: 30, width: "100%", marginTop: 12, flexDirection: 'row', }}>
                <Text style={styles.FunctionKeys_btn}>改良</Text>
                <Text style={styles.FunctionKeys_btn}>加速</Text>
                <Text style={styles.FunctionKeys_btn}>采集</Text>
            </View>
        )
    }

    const NotDeveloped = (item) => {
        return (
            <View style={{ height: 230, width: "100%", marginTop: 24, padding: 12, borderWidth: 1, borderColor: "#000", backgroundColor: "#d9d9d9", justifyContent: "center", alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: "#000" }}>未开辟</Text>
            </View>
        )
    }

    // {"grade": 1, "id": 1, "lingQiZhi": 100, "status": 1}, {"grade": 1, "id": 2, "lingQiZhi": 100, "status": 0}
    const renderItem = ({ item }) => {
        if (item.status === 0) return <NotDeveloped />

        return (
            <View style={{ width: "100%", marginTop: 24, padding: 12, borderWidth: 1, borderColor: "#000", backgroundColor: "#d9d9d9" }}>
                <View style={{ height: 200, width: "100%", flexDirection: "row" }}>
                    <View style={{ width: 50, }}>
                        <Grade {...item} />
                    </View>
                    <View style={{ flex: 1, backgroundColor: "#237804" }}>
                        <Plant {...item} />
                    </View>
                    <View style={{ width: 70, }}>
                        <Equipment {...item} />
                    </View>
                </View>
                <FunctionKeys {...item} />
            </View>
        )
    }

    if (DATA.length === 0) {
        return <></>
    }

    return (
        <FlatList
            data={DATA}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 50 }} />}
        />
    )
}

export default connect((state) => ({ ...state.PropsModel, ...state.PlantModel }))(Farm);

const styles = StyleSheet.create({
    equipment_btn: {
        height: 30,
        width: "80%",
        textAlign: 'center',
        backgroundColor: "#95de64",
        lineHeight: 30,
        fontSize: 16,
        color: "#1f1f1f",
    },
    FunctionKeys_btn: {
        fontSize: 16,
        color: "#1f1f1f",
        height: 30,
        lineHeight: 30,
        width: 60,
        textAlign: 'center',
        backgroundColor: "#95de64",
        marginLeft: 12,
    },
})
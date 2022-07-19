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
import RootView from '../RootView';
import Toast from '../toast';
import { now } from '../../utils/DateTimeUtils';

import Formula from './Formula'
import UndoneProgressBar from './farmComponents/UndoneProgressBar';
import Improve from './Improve';
import Accelerate from './Accelerate';




// 状态 status: 0-未开启, 1-开启但未种植, 2-种植中,

const Farm = (props) => {

    const { lingTianData, lingTianName, plantComposeConfig } = props

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
        const lingQiZhi_online = item.grade * 1000  // 灵气槽的容量
        const proportion = container_height / lingQiZhi_online  // 相对于容器高度的比例
        const lingQiZhi_height = container_height - (lingQiZhi * proportion)  // 灵气值显示高度 :180 - 18 =162
        const translateY = useRef(new Animated.Value(lingQiZhi_height)).current;

        return (
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "center", fontSize: 16, backgroundColor: "#2ecc71", height: 20, lineHeight: 20 }}>{item.grade}</Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={{ height: container_height, width: 20, backgroundColor: "#135200", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                        <Animated.View style={{ width: 20, backgroundColor: "#4f6f46", height: container_height, position: "absolute", transform: [{ translateY }] }}></Animated.View>
                        <Text style={{ width: 10, textAlign: "center" }}>{lingQiZhi}/{lingQiZhi_online}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const Plant = (item) => {
        const showFormula = () => {
            props.dispatch(action("PlantModel/selectedLingTian")({ lingTianName, lingTianId: item.id }))
            const key = RootView.add(<Formula onClose={() => { RootView.remove(key); }} />);
        }

        // 点击事件
        const onPress = () => {
            if (item.status === 3) return Toast.show("请先采集")
            if (item.status === 2) return Toast.show("已种植")
            if (item.status === 1) return showFormula()
        }

        // 进度条
        const ProgressBar = () => {
            if (item.status === 1) {
                return (
                    <View style={{ height: 20, width: 100, backgroundColor: "#d9d9d9", borderRadius: 12, overflow: 'hidden' }}>
                        <Text style={{ textAlign: 'center' }}>0%</Text>
                    </View>
                )
            }
            if (item.status === 3) {
                return (
                    <View style={{ height: 20, width: 100, backgroundColor: "#d9d9d9", borderRadius: 12, overflow: 'hidden' }}>
                        <View style={{
                            position: "absolute", top: 0, left: 0, height: 20, width: "100%", backgroundColor: "#595959", zIndex: 0,
                        }} ></View>
                        <Text style={{ textAlign: 'center' }}>100%</Text>
                    </View>
                )
            }

            // 时间差
            const diffTime = Math.floor((now() - item.plantTime) / 1000)

            // 当前需要的时间
            const currentNeedTime = item.needTime - diffTime

            if (currentNeedTime < 0) {
                props.dispatch(action("PlantModel/changePlantStatus")({ lingTianName, lingTianId: item.id, status: 3 }))
                return (
                    <View style={{ height: 20, width: 100, backgroundColor: "#d9d9d9", borderRadius: 12, overflow: 'hidden' }}>
                        <View style={{
                            position: "absolute", top: 0, left: 0, height: 20, width: "100%", backgroundColor: "#595959", zIndex: 0,
                        }} ></View>
                        <Text style={{ textAlign: 'center' }}>100%</Text>
                    </View>
                )
            }

            return <UndoneProgressBar currentNeedTime={currentNeedTime} needTime={item.needTime} lingTianName={lingTianName} lingTianId={item.id} />
        }

        const Title = () => {
            let content = "待种植"
            if (item.status !== 1) {
                // 正在种植的配方
                const plantRecipe = plantComposeConfig.find(f => f.id === item.plantRecipeId)
                content = `正在种植-${plantRecipe.name}`
            }

            return (
                <Text style={{ width: 150, height: 30, lineHeight: 30, fontSize: 20, textAlign: "center", backgroundColor: "#389e0d" }}>
                    {content}
                </Text>
            )
        }

        return (
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onPress}>
                <View style={{ flex: 1 }}>
                    <Title />
                    <View style={styles.plant_ProgressBar_container}>
                        <ProgressBar />
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
        const collection = () => {
            if (item.status === 2) return Toast.show("种植物还未成熟,不可采集")
            if (item.status === 1) return Toast.show("请先种植")
            props.dispatch(action("PlantModel/collection")({ lingTianName, lingTianId: item.id }))
        }

        // 显示改良弹窗
        const showImprove = () => {
            const key = RootView.add(<Improve onClose={() => { RootView.remove(key); }} lingTianName={lingTianName} lingTianId={item.id} />);
        }

        // 显示加速弹窗
        const showAccelerate = () => {
            if (item.status === 3) return Toast.show("种植物已成熟,不能加速")
            if (item.status === 1) return Toast.show("请先种植")
            const key = RootView.add(<Accelerate onClose={() => { RootView.remove(key); }} lingTianName={lingTianName} lingTianId={item.id} />);
        }

        return (
            <View style={{ height: 30, width: "100%", marginTop: 12, flexDirection: 'row', }}>
                <Text style={styles.FunctionKeys_btn} onPress={showImprove}>改良</Text>
                <Text style={styles.FunctionKeys_btn} onPress={showAccelerate}>加速</Text>
                <Text style={styles.FunctionKeys_btn} onPress={collection}>采集</Text>
            </View>
        )
    }

    const NotDeveloped = (item) => {
        return (
            <View style={{ height: 230, width: "100%", marginTop: 24, padding: 12, borderWidth: 1, borderColor: "#000", backgroundColor: "#d9d9d9", justifyContent: "center", alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: "#000" }}>未解锁</Text>
            </View>
        )
    }

    // {"grade": 1, "id": 1, "lingQiZhi": 80, "needTime": 1000, "plantRecipeId": 101, "plantTime": 1657163905426, "status": 2, "targets": {"id": 53, "num": 1, "range": [Array], "rate": 20}}
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
            keyExtractor={(item, index) => item + index}
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
    plant_ProgressBar_container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: "#389e0d",
        justifyContent: "center",
        alignItems: 'center'
    },
    plant_ProgressBar_box: {
        position: "absolute",
        top: 0,
        height: 20,
        width: "100%",
        backgroundColor: "#8c8c8c",
        zIndex: 0,
    }
})
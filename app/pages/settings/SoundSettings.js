import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';

import { connect, action } from "../../constants";
import { Panel } from '../../components/panel'
import { TextButton } from '../../constants/custom-ui';


const TitleText = (props) => {
    return (
        <View style={[styles.bgColor, { width: "60%", marginTop: 40, alignItems: 'center' }]}>
            <Text style={[styles.fontColor, styles.title]}>{props.children}</Text>
        </View>
    )
}

const DividingLine = () => {
    return (
        <View style={styles.dividingLine}></View>
    )
}

const ItemRender = (props) => {
    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ width: "50%" }}>
                    <Text style={[styles.btn, { width: "50%" }]}>{props.title}</Text>
                </View>
                <View style={{ width: "20%", }}>
                    <TouchableOpacity onPress={() => { console.log("fff"); }}>
                        <Text style={[styles.btn, { width: "100%" }]}>复位</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "20%" }}>
                    <TouchableOpacity onPress={() => { console.log("ccc"); }}>
                        <Text style={[styles.btn, { width: "100%" }]}>测试</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ height: 60, width: "100%", justifyContent: 'center', }}>
                <Slider
                    value={props.value}
                    step={1}
                    maximumValue={100}
                    minimumValue={0}
                    minimumTrackTintColor={"#066dff"}
                    maximumTrackTintColor={"#b0b0b0"}
                    onValueChange={(value) => { }}
                    onSlidingComplete={(value) => { }}
                />
            </View>
        </View>
    )
}

const SoundSettings = (props) => {
    return (
        <Panel>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingLeft: 24, paddingRight: 24 }}>
                    <TitleText>音量设置</TitleText>
                    <DividingLine />
                    <ItemRender title={"音量"} value={10} default={10} />
                    <DividingLine />
                    <ItemRender title={"音效"} value={10} default={10} />
                    <DividingLine />
                    <TitleText>阅读时音量设置</TitleText>
                    <DividingLine />
                    <ItemRender title={"音量"} value={10} default={10} />
                    <DividingLine />
                    <ItemRender title={"音效"} value={10} default={10} />
                    <DividingLine />
                    <View style={{ marginTop: 24, width: "40%" }}>
                        <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                            <Text style={styles.btn} >
                                退出
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Panel>
    )
}

export default SoundSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        paddingTop: 4,
        paddingBottom: 4
    },
    fontColor: {
        color: "#273136",
    },
    bgColor: {
        backgroundColor: '#bae8ff',
    },
    dividingLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#7a94b2",
        marginBottom: 16,
        marginTop: 16,
    },
    btn: {
        color: "#273136",
        backgroundColor: '#bae8ff',
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4
    }
})
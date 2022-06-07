import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, DeviceEventEmitter, ScrollView } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';

import { connect, action, EventKeys, } from "../../constants";
import { Panel } from '../../components/panel'
import { Switch, ListItem } from '@rneui/themed';


const TitleText = (props) => {
    return (
        <View style={[styles.bgColor, { width: "55%", marginTop: 40, alignItems: 'center' }]}>
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
                    <TouchableOpacity onPress={() => {
                        props.updataState(props.default)
                        props.onValueChange(props.default)
                    }}>
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
                    step={0.01}
                    maximumValue={1}
                    minimumValue={0}
                    minimumTrackTintColor={"#066dff"}
                    maximumTrackTintColor={"#b0b0b0"}
                    onValueChange={(value) => { props.onValueChange(value) }}
                    onSlidingComplete={(value) => { props.updataState(value) }}
                />
            </View>
        </View>
    )
}

class SoundSettings extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            masterVolume: this.props.masterVolume.bg,
            sceneSound: this.props.masterVolume.effct,
            readerVolume: this.props.readerVolume.bg,
            readerSound: this.props.readerVolume.effct,
            isFollowMasterVolume: false,
        }
    }

    // 音量设置 key: SOUND_BG_VOLUME_UPDATE
    // 音效设置 key: SOUND_EFFECT_VOLUME_UPDATE

    handlerReaderVolume = (value) => {
        if (value) {
            DeviceEventEmitter.emit(EventKeys.SOUND_BG_VOLUME_UPDATE, { type: "readerVolume", volume: this.state.masterVolume })
            DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, { type: "readerVolume", volume: this.state.sceneSound })
        }
        this.setState({ isFollowMasterVolume: value })
    }

    render() {
        return (
            <Panel>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1, paddingLeft: 24, paddingRight: 24 }}
                    >
                        <TitleText>主音量设置</TitleText>
                        <DividingLine />
                        <ItemRender
                            title={"音量"}
                            value={this.state.masterVolume}
                            default={0.5}
                            onValueChange={(value) => {
                                DeviceEventEmitter.emit(EventKeys.SOUND_BG_VOLUME_UPDATE, { type: "masterVolume", volume: value })
                            }}
                            updataState={(value) => { this.setState({ masterVolume: value }) }}
                        />
                        <DividingLine />
                        <ItemRender
                            title={"音效"}
                            value={this.state.sceneSound}
                            default={0.5}
                            onValueChange={(value) => {
                                DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, { type: "masterVolume", volume: value })
                            }}
                            updataState={(value) => { this.setState({ sceneSound: value }) }}
                        />
                        <DividingLine />
                        <ListItem.Accordion
                            isExpanded={!this.state.isFollowMasterVolume}
                            Component={() => {
                                return (
                                    <>
                                        <View style={styles.readerVolumeContainer}>
                                            <TitleText>阅读时音量设置</TitleText>
                                            <View style={{
                                                flexDirection: "row",
                                                flexWrap: "nowrap",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                                marginTop: 40,
                                            }}>
                                                <Text style={styles.fontColor}>跟随主音量</Text>
                                                <Switch
                                                    color={"#bae8ff"}
                                                    value={this.state.isFollowMasterVolume}
                                                    onValueChange={(value) => this.handlerReaderVolume(value)}
                                                />
                                            </View>
                                        </View>
                                        <DividingLine />
                                    </>
                                )
                            }}
                        >
                            <ItemRender
                                disabled={this.state.isFollowMasterVolume}
                                title={"音量"}
                                value={this.state.readerVolume}
                                default={0.5}
                                onValueChange={(value) => {
                                    DeviceEventEmitter.emit(EventKeys.SOUND_BG_VOLUME_UPDATE, { type: "readerVolume", volume: value })
                                }}
                                updataState={(value) => { this.setState({ readerVolume: value }) }}
                            />
                            <DividingLine />
                            <ItemRender
                                title={"音效"}
                                value={this.state.readerSound}
                                default={0.5}
                                onValueChange={(value) => {
                                    DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, { type: "readerVolume", volume: value })
                                }}
                                updataState={(value) => { this.setState({ readerSound: value }) }}
                            />
                            <DividingLine />
                        </ListItem.Accordion>
                        <View style={{ marginTop: 24, width: "40%" }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                                <Text style={styles.btn} >
                                    退出
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Panel>
        )
    }
}

export default connect((state) => ({ ...state.SoundModel }))(SoundSettings)

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
    readerVolumeContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
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
import { View, Text, SafeAreaView, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect } from 'react'

import { connect, action } from '../../constants'
import { h_m_s_Format } from '../../utils/DateTimeUtils'
import { px2pd } from '../../constants/resolution';

import { TextButton } from '../../constants/custom-ui'
import Toast from '../toast'
import ImageCapInset from 'react-native-image-capinsets-next';
import { TitleComponent } from '../alchemyRoom/DanFangDetailPage';



const Detail = (props) => {
    const { item, plantRecipeDetail, lingTianId } = props
    // console.log("plantRecipeDetail", plantRecipeDetail);

    useEffect(() => {
        props.dispatch(action("PlantModel/formulaDetail")(item))
    }, [])

    const plantHandler = () => {
        if (!item.valid) return Toast.show("材料不足")

        props.dispatch(action("PlantModel/plant")(item)).then((result) => {
            props.onClose()
            props.onCloseFormula()
        })
    }

    const renderStuffs = (data) => {
        const { name, currNum, reqNum } = data.item
        return (
            <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi_gray.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                />
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
                        {name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: (currNum < reqNum) ? "#c12c1f" : "#000", }}>
                            {currNum}
                        </Text>
                        <Text style={{ fontSize: 16, color: "#000", }}>
                            /{reqNum}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderTargets = (data) => {
        const { name, productNum } = data.item
        return (
            <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi_gray.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                />
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
                        {name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: "#000", }}>
                            {productNum}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderProps = (data) => {
        const { name, currNum, reqNum } = data.item
        return (
            <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi_gray.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                />
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
                        {name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: (currNum < reqNum) ? "#c12c1f" : "#000", }}>
                            {currNum}
                        </Text>
                        <Text style={{ fontSize: 16, color: "#000", }}>
                            /{reqNum}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }


    // {"id": 101, 
    // "propsDetail": [{"currNum": 100, "name": "西瓜刀", "reqNum": 1}], 
    // "stuffsDetail": [{"currNum": 98, "name": "西瓜", "reqNum": 1}, {"currNum": 96, "name": "苹果", "reqNum": 2}], 
    // "targets": [{"currNum": 3, "desc": "样式漂亮的水果拼盘", "name": "西瓜拼盘", "productNum": 1}, {"currNum": 1, "desc": "样式漂亮的水果拼盘", "name": "优秀的西瓜 拼盘", "productNum": 1}]}
    return (
        <View style={{ flex: 1 }}>
            <Image style={{ position: "absolute", width: px2pd(1080), height: px2pd(2400) }} source={require('../../../assets/plant/plantBg.jpg')} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        height: 50,
                        lineHeight: 50,
                        textAlign: 'center',
                        fontSize: 24,
                        color: '#000',
                    }}>
                        材料选择
                    </Text>
                    <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, }}>
                        <TitleComponent title={"原材料数"} style={{ marginTop: 12 }} />

                        <View>
                            <FlatList
                                data={plantRecipeDetail.stuffsDetail}
                                renderItem={renderStuffs}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        <View style={styles.expected_container}>
                            <TitleComponent title={"预计获得"} />
                            <TitleComponent
                                title={`预计耗时:${h_m_s_Format(item.time)}`}
                                source={require('../../../assets/button/lianDan2.png')}
                                style={{ width: px2pd(500), height: px2pd(108), marginLeft: 8 }}
                            />
                        </View>
                        <View>
                            <FlatList
                                data={plantRecipeDetail.targets}
                                renderItem={renderTargets}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>

                        <TitleComponent title={"辅助材料"} style={{ marginTop: 12 }} />
                        <View>
                            <FlatList
                                data={plantRecipeDetail.propsDetail}
                                renderItem={renderProps}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginBottom: 12 }}>
                        <TextButton
                            title={'退出'}
                            onPress={() => {
                                props.onClose();
                            }}
                        />
                        <TextButton
                            title={'种植'}
                            onPress={plantHandler}
                        />
                    </View>
                </View>
            </SafeAreaView >
        </View>
    )
}

export default connect((state) => ({ ...state.PlantModel }))(Detail)

const styles = StyleSheet.create({
    expected_container: {
        flexDirection: "row",
        marginTop: 12,
    },
    title_box: {
        height: 40,
        lineHeight: 40,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: "#389e0d",
        fontSize: 16,
        color: "#1f1f1f",
        textAlign: 'center',
    },
})
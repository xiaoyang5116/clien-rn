import { ScrollView, Text, View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import Classification from './Classification';

// import { px2pd } from '../../../../constants/resolution';


const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        img: require("../../../../../../assets/linshi/linshi1.png")
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        img: require("../../../../../../assets/linshi/linshi2.png")
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        img: require("../../../../../../assets/linshi/linshi3.png")
    },
];

const FeaturedPage = (props) => {

    const renderRecommend = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { console.log("ssss"); }}>
                <View style={{ width: 150, height: 200, borderRadius: 6, backgroundColor: '#ccc', marginRight: 12, overflow: 'hidden' }}>
                    <Image
                        // style={{ width: px2pd(51), height: px2pd(38) }}
                        style={{ width: "100%", height: "100%" }}
                        source={item.img}
                    />
                </View>
            </TouchableOpacity>

        )
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, }}
        >
            {/* 走马灯 */}

            {/* 小游戏 */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ width: "100%", height: 120, }}
            >
                <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: '#ccc', marginRight: 12, overflow: "hidden" }}></View>
                <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: '#ccc', marginRight: 12, overflow: "hidden" }}></View>
                <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: '#ccc', overflow: "hidden" }}></View>
            </ScrollView>

            {/* 为你推荐 */}
            <Text style={{ fontSize: 18, color: "#000", fontWeight: 'bold', marginBottom: 12, marginTop: 8 }}>为你推荐</Text>
            <FlatList
                data={DATA}
                renderItem={renderRecommend}
                keyExtractor={item => item.id}
                horizontal
                initialNumToRender={2}
                showsHorizontalScrollIndicator={false}
            />

            {/* 分类 */}
            <Classification />
            {/* 分类 */}
            <Classification />
            <View style={{ height: 50 }}></View>
        </ScrollView>
    )
}

export default FeaturedPage

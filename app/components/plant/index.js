import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native'
import React, { useRef, useState } from 'react'

import RootView from '../RootView'
import { px2pd } from '../../constants/resolution'

import Carousel from 'react-native-snap-carousel'
import Farm from './Farm'
import { TextButton } from '../../constants/custom-ui'


const img = [
    { source: require('../../../assets/plant/header/title_bg.png') },
    { source: require('../../../assets/plant/header/title_bg_checked.png') }
]

const DATA = ["顾春园", "盛夏园", "秋雨园", "寒冬园"]

const sliderWidth = Dimensions.get('window').width
const itemWidth = Dimensions.get('window').width

const HeaderTitle = (props) => {
    const { tabIndex, changeTabIndex } = props

    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { changeTabIndex(index) }}>
                <ImageBackground source={tabIndex === index ? img[1].source : img[0].source}>
                    <Text style={styles.header_title}>{item}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ marginTop: (Platform.OS == 'android') ? 12 : null }}>
            <FlatList
                data={DATA}
                renderItem={_renderItem}
                extraData={tabIndex}
                numColumns={4}
                columnWrapperStyle={{
                    justifyContent: "space-around"
                }}
            />
        </View>
    )
}

const Plant = (props) => {
    const [tabIndex, setTabIndex] = useState(0)
    const _carouselRef = useRef()

    const changeTabIndex = (index) => {
        _carouselRef.current.snapToItem(index)
        setTabIndex(index)
    }

    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <Farm lingTianName={item} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }} >
            <Image style={{ position: "absolute", width: px2pd(1080), height: px2pd(2400) }} source={require('../../../assets/plant/plantBg.jpg')} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <HeaderTitle tabIndex={tabIndex} changeTabIndex={changeTabIndex} />
                    <Carousel
                        data={DATA}
                        ref={_carouselRef}
                        loop={true}
                        renderItem={_renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={0}
                        inactiveSlideShift={1}
                        inactiveSlideScale={1}
                        onSnapToItem={index => setTabIndex(index)}
                    />
                    <View style={{ position: "absolute", bottom: 0, left: 40, height: 40 }}>
                        <TextButton title={"退出"} onPress={props.onClose} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Plant

export class PlantPage {
    static show() {
        const key = RootView.add(
            <Plant onClose={() => { RootView.remove(key) }} />
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        marginTop: 12,
    },
    header_title_box: {
        backgroundColor: undefined,
        justifyContent: "center",
        alignItems: "center"
    },
    header_title: {
        width: px2pd(250),
        height: px2pd(94),
        textAlign: 'center',
        lineHeight: px2pd(94),
        fontSize: 16
    }
})

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'

import { action, connect, EventKeys } from "../../constants"
import RootView from '../RootView';
import Toast from '../toast';
import { now } from '../../utils/DateTimeUtils';
import { px2pd } from '../../constants/resolution';
import lo from 'lodash'

import Formula from './Formula'
import UndoneProgressBar from './farmComponents/UndoneProgressBar';
import Improve from './Improve';
import Accelerate from './Accelerate';
import SpriteSheet from '../SpriteSheet';
import RewardsPage from '../alchemyRoom/components/RewardsPage';
import { ImageButton } from '../../constants/custom-ui';


// 状态 status: 0-未开启, 1-开启但未种植, 2-种植中, 3-已成熟
function bgImg(status) {
    const img = [
        { status: 1, styles: { width: px2pd(954), height: px2pd(244) }, source: require('../../../assets/plant/daizhongzhi.png') },
        { status: 2, styles: { width: px2pd(958), height: px2pd(242) }, source: require('../../../assets/plant/yizhongzhi_bg.png') },
        { status: 3, styles: { width: px2pd(968), height: px2pd(244) }, source: require('../../../assets/plant/shouhuo.png') },
    ]
    return img.find(i => i.status === status)
}

// 进度条容器

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

    // 灵气值
    const Grade = (item) => {
        const container_height = px2pd(198)  // 容器显示的高度
        let lingQiZhi = item.lingQiZhi // 有多少灵气
        if (item.lingQiZhi > 1000) {
            lingQiZhi = (item.lingQiZhi % 1000)
        }
        const lingQiZhi_online = 1000  // 灵气槽的容量
        const baifenbi = parseInt((lingQiZhi / lingQiZhi_online) * 100)
        const proportion = container_height / lingQiZhi_online  // 相对于容器高度的比例
        const lingQiZhi_height = container_height - (lingQiZhi * proportion)  // 灵气值显示高度
        const translateY = useRef(new Animated.Value(lingQiZhi_height)).current;

        // 显示改良弹窗
        const showImprove = () => {
            const key = RootView.add(<Improve onClose={() => { RootView.remove(key); }} lingTianName={lingTianName} lingTianId={item.id} />);
        }

        const sheet = React.createRef(null);
        useEffect(() => {
            const play = type => {
                sheet.current.play({
                    type,
                    fps: Number(5),
                    resetAfterFinish: false,
                    loop: true,
                    onFinish: () => {
                    },
                });
            }

            play('walk');
        }, [])

        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: "#fff", fontSize: 12 }}>{baifenbi}%</Text>
                <TouchableWithoutFeedback onPress={showImprove}>
                    <ImageBackground source={require('../../../assets/plant/lingqicao.png')}
                        style={{
                            width: px2pd(38),
                            height: px2pd(198),
                            overflow: "hidden",
                            borderRadius: 5,
                        }}
                    >
                        {/* <Animated.Image
                            source={require('../../../assets/plant/lingqicao2.png')}
                            style={{ width: px2pd(38), height: px2pd(198), position: 'absolute', transform: [{ translateY }] }}
                            pointerEvents="none"
                        /> */}
                        <Animated.View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                transform: [{ translateY }]
                            }}
                            pointerEvents="none"
                        >
                            <SpriteSheet
                                ref={ref => (sheet.current = ref)}
                                source={require('../../../assets/animations/lingqitiao2.png')}
                                columns={25}
                                rows={4}
                                frameWidth={30}
                                frameHeight={190}
                                imageStyle={{}}
                                animations={{
                                    walk: lo.range(90),
                                }}
                            />
                        </Animated.View>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View >
        )
    }

    // 种植
    const Plant = (item) => {
        const showFormula = () => {
            props.dispatch(action("PlantModel/selectedLingTian")({ lingTianName, lingTianId: item.id }))
            const key = RootView.add(<Formula onClose={() => { RootView.remove(key); }} />);
        }

        // 点击事件
        const onPress = () => {
            if (item.status === 3) {
                // return Toast.show("请先采集")
                return props.dispatch(action("PlantModel/getCollectionData")({ lingTianName, lingTianId: item.id })).then(result => {
                    const { propConfig, currentLingTianData, targetsData } = result
                    const data = {}
                    data.targets = [propConfig]
                    const key = RootView.add(
                        <RewardsPage
                            title={"获得道具"}
                            recipe={data}
                            getAward={() => {
                                props.dispatch(action("PlantModel/collection")({ lingTianData: currentLingTianData, targetsData, propConfig }))
                            }}
                            onClose={() => {
                                RootView.remove(key);
                            }}
                        />,
                    );
                })
            }
            if (item.status === 2) {
                return Toast.show("已种植")
                // const key = RootView.add(<Accelerate onClose={() => { RootView.remove(key); }} lingTianName={lingTianName} lingTianId={item.id} />);
                // return null
            }
            if (item.status === 1) return showFormula()
        }

        // 进度条
        const ProgressBar = () => {
            if (item.status === 1) return null
            if (item.status === 3) return null

            // 时间差
            const diffTime = Math.floor((now() - item.plantTime) / 1000)

            // 当前需要的时间
            const currentNeedTime = item.needTime - diffTime

            if (currentNeedTime < 0) {
                props.dispatch(action("PlantModel/changePlantStatus")({ lingTianName, lingTianId: item.id, status: 3 }))
                return (
                    <View style={styles.plant_ProgressBar_container}>
                        <View style={{ height: 10, width: 300, backgroundColor: "#33ad85", borderRadius: 12, overflow: 'hidden', position: "absolute" }}></View>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: "#000", }}>100%</Text>
                    </View>
                )
            }

            return (
                <View style={styles.plant_ProgressBar_container} pointerEvents="none">
                    <UndoneProgressBar currentNeedTime={currentNeedTime} needTime={item.needTime} lingTianName={lingTianName} lingTianId={item.id} />
                </View>
            )
        }

        const Title = () => {
            let content = "未种植: 点击选择种子"
            if (item.status == 2) {
                // 正在种植的配方
                const plantRecipe = plantComposeConfig.find(f => f.id === item.plantRecipeId)
                content = `已种植: ${plantRecipe.name}`
            }
            if (item.status == 3) {
                content = `已成熟: 点击收获`
            }

            return (
                <View style={[styles.statusContainer, { height: px2pd(52), width: px2pd(660), }]} pointerEvents="none">
                    <Image style={{ position: 'absolute', height: px2pd(52), width: px2pd(660), }} source={require('../../../assets/plant/status_bg.png')} />
                    <Text style={{ fontSize: 15, color: "#000", textAlign: "center" }}>{content}</Text>
                </View>

            )
        }

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <ImageBackground source={bgImg(item.status).source} style={{ ...bgImg(item.status).styles, justifyContent: "center", alignItems: "center", transform: [{ scale: 0.9 }] }}>
                    <Title />
                    <ProgressBar />
                </ImageBackground>
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

    // 功能键
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

    // 未解锁
    const NotDeveloped = (item) => {
        return (
            <View style={styles.box}>
                <ImageBackground source={require('../../../assets/plant/not_unlocked.png')} style={[styles.box_bgImg, {
                    justifyContent: "center",
                    alignItems: "center"
                }]}>
                    <View style={styles.statusContainer}>
                        <Image source={require('../../../assets/plant/status_bg.png')} style={styles.status_bg} />
                        <Text style={{ fontSize: 16, color: "#000", textAlign: "center" }}>小世界升级之后可解锁</Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    // 灵田等级
    const HeaderTitle = (item) => {
        const { grade } = item
        return (
            <ImageBackground
                source={require('../../../assets/plant/title_bg.png')}
                style={styles.box_title}
            >
                <Text style={{ fontSize: 16, color: "#000" }}>{grade} 阶灵田</Text>
            </ImageBackground>
        )
    }

    // 底部
    const Footer = (item) => {
        const showAccelerate = () => {
            if (item.status === 3) return Toast.show("种植物已成熟,不能加速")
            if (item.status === 1) return Toast.show("请先种植")
            const key = RootView.add(<Accelerate onClose={() => { RootView.remove(key); }} lingTianName={lingTianName} lingTianId={item.id} />);
        }
        return (
            <View style={{ width: "100%", marginTop: 4, flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ position: "absolute", left: 12 }}>
                    <Text style={{ fontSize: 12, color: "#fff" }}>灵气: {item.lingQiZhi}</Text>
                </View>
                <View style={{ width: px2pd(242), height: px2pd(68), justifyContent: "center", alignItems: 'center', }}>
                    {item.status != 2 ? (
                        <Image source={require('../../../assets/plant/btn_bg2.png')} style={{ width: px2pd(242), height: px2pd(68) }} />
                    ) : (
                        <ImageButton
                            width={px2pd(242)}
                            height={px2pd(68)}
                            source={require('../../../assets/plant/btn_bg.png')}
                            selectedSource={require('../../../assets/plant/btn_bg1.png')}
                            onPress={showAccelerate}
                        />
                    )}
                    <View pointerEvents={'none'} style={{ position: 'absolute' }}>
                        <Text style={{ fontSize: 14, color: "#000" }}>加速</Text>
                    </View>
                </View>
            </View>

        )
    }

    // {"grade": 1, "id": 1, "lingQiZhi": 80, "needTime": 1000, "plantRecipeId": 101, "plantTime": 1657163905426, "status": 2, "targets": {"id": 53, "num": 1, "range": [Array], "rate": 20}}
    const renderItem = ({ item }) => {
        if (item.status === 0) return <NotDeveloped />

        return (
            <View style={styles.box}>
                <ImageBackground source={require('../../../assets/plant/box_bg.png')} style={[styles.box_bgImg, {
                    alignItems: 'center'
                }]} >
                    <HeaderTitle {...item} />
                    <View style={{ width: "100%", flexDirection: 'row', marginTop: 8, justifyContent: "center", paddingLeft: 4, paddingRight: 4 }}>
                        <Grade {...item} />
                        <Plant {...item} />
                    </View>
                    <Footer {...item} />
                    {/* <View style={{ width: 70, }}>
                            <Equipment {...item} />
                        </View> */}
                    {/* <FunctionKeys {...item} /> */}
                </ImageBackground>
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
    },
    box: {
        width: "100%",
        marginTop: 24,
        justifyContent: "center",
        alignItems: 'center'
    },
    box_bgImg: {
        width: px2pd(1052),
        height: px2pd(364),
    },
    statusContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    status_bg: {
        position: "absolute",
        zIndex: 0,
        height: px2pd(52),
        width: px2pd(660),
    },
    box_title: {
        position: "absolute",
        top: -8,
        zIndex: 99,
        height: px2pd(70),
        width: px2pd(410),
        justifyContent: "center",
        alignItems: "center"
    }

})
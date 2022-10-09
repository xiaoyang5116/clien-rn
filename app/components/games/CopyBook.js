import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PanResponder,
    Image,
    Animated,
    Platform
} from 'react-native';

import Svg, { Path, } from 'react-native-svg'
import { px2pd } from '../../constants/resolution';

import { statusBarHeight } from '../../constants'
import { TextButton } from '../../constants/custom-ui';
import Toast from '../toast'
import FastImage from 'react-native-fast-image';
import HuoYanAnimation from '../animation/HuoYan';

// 笔画次数配置时候需要多加一笔
const ziTieArr = [
    {
        id: 0,
        name: "木",
        img: require('../../../assets/games/ziTie/mu.png'),
        strokes: 5,
        detectionArea: [
            { origin: [89, 95], width: 15, height: 14 },
            { origin: [120, 95], width: 15, height: 14 },
            { origin: [145, 95], width: 15, height: 14 },
            { origin: [89, 174], width: 14, height: 12 },
            { origin: [145, 65], width: 15, height: 15 },
            { origin: [145, 174], width: 15, height: 15 },
            { origin: [190, 95], width: 15, height: 14 },
            { origin: [190, 161], width: 12, height: 12 },
        ]
    },
    {
        id: 1,
        name: "仙",
        strokes: 7,
        img: require('../../../assets/games/ziTie/xian.png'),
        detectionArea: [
            { origin: [108, 80], width: 13, height: 12 },
            { origin: [168, 80], width: 14, height: 14 },
            { origin: [99, 109], width: 15, height: 15 },
            { origin: [132, 109], width: 14, height: 15 },
            { origin: [204, 109], width: 15, height: 15 },
            { origin: [83, 134], width: 11, height: 11 },
            { origin: [99, 198], width: 15, height: 15 },
            { origin: [132, 198], width: 14, height: 15 },
            { origin: [168, 198], width: 14, height: 12 },
            { origin: [204, 198], width: 15, height: 12 },
        ]
    },
    {
        id: 2,
        name: "火",
        strokes: 5,
        img: require('../../../assets/games/ziTie/huo.png'),
        detectionArea: [
            { origin: [81, 94], width: 13, height: 13 },
            { origin: [223, 94], width: 15, height: 17 },
            { origin: [62, 137], width: 13, height: 14 },
            { origin: [205, 137], width: 13, height: 14 },
            { origin: [133, 137], width: 23, height: 24 },
            { origin: [139, 51], width: 19, height: 16 },
            { origin: [62, 233], width: 12, height: 17 },
            { origin: [205, 224], width: 14, height: 14 },

        ]
    },
    {
        id: 3,
        name: "雷",
        strokes: 16,
        img: require('../../../assets/games/ziTie/lei.png'),
        detectionArea: [
            // 雨
            { origin: [77, 46], width: 25, height: 20 },
            { origin: [200, 46], width: 25, height: 20 },
            { origin: [139, 46], width: 22, height: 20 },

            { origin: [50, 75], width: 23, height: 22 },
            { origin: [136, 75], width: 26, height: 22 },
            { origin: [226, 75], width: 24, height: 22 },

            { origin: [50, 102], width: 23, height: 21 },
            { origin: [76, 102], width: 20, height: 21 },
            { origin: [114, 102], width: 19, height: 21 },
            { origin: [136, 102], width: 26, height: 21 },
            { origin: [164, 102], width: 24, height: 21 },
            { origin: [202, 102], width: 21, height: 21 },
            { origin: [226, 102], width: 24, height: 21 },

            { origin: [71, 128], width: 22, height: 21 },
            { origin: [111, 128], width: 22, height: 21 },
            { origin: [165, 128], width: 23, height: 21 },
            { origin: [202, 128], width: 18, height: 21 },

            // 田
            { origin: [68, 156], width: 25, height: 21 },
            { origin: [136, 156], width: 26, height: 21 },
            { origin: [206, 156], width: 25, height: 21 },

            { origin: [68, 190], width: 25, height: 21 },
            { origin: [136, 190], width: 26, height: 21 },
            { origin: [206, 190], width: 25, height: 21 },

            { origin: [68, 225], width: 25, height: 21 },
            { origin: [136, 225], width: 26, height: 21 },
            { origin: [206, 225], width: 25, height: 21 },

            // 特殊
            { origin: [68, 182], width: 25, height: 10 },
            { origin: [136, 182], width: 26, height: 10 },
            { origin: [206, 182], width: 25, height: 10 },
            { origin: [68, 217], width: 25, height: 10 },
            { origin: [136, 217], width: 26, height: 10 },
            { origin: [206, 217], width: 25, height: 10 },

            { origin: [111, 157], width: 10, height: 21 },
            { origin: [111, 190], width: 10, height: 21 },
            { origin: [111, 225], width: 10, height: 21 },
            { origin: [183, 157], width: 10, height: 21 },
            { origin: [183, 190], width: 10, height: 21 },
            { origin: [183, 225], width: 10, height: 21 },
        ]
    }
]

//获取屏幕的宽高
const { width, height } = Dimensions.get('window');

const box_width = 300
const scopeLeft = (width - box_width) / 2 + 5
const scopeRight = scopeLeft + box_width - 5
let scopeTop = ((height - box_width) / 2) + 5

if (Platform.OS === "android") {
    scopeTop += statusBarHeight + 5
}
const scopeBottom = scopeTop + box_width - 5


const HuoYna = (props) => {
    const { nextZiTie } = props

    const translateY = useRef(new Animated.Value(box_width)).current
    const bottom = useRef(new Animated.Value(0)).current

    useEffect(() => {
        show()
    }, [])

    const show = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 1400,
                delay: 300,
                useNativeDriver: false,
            }),
            Animated.timing(bottom, {
                toValue: box_width,
                duration: 1500,
                delay: 200,
                useNativeDriver: false,
            }),
        ]).start(nextZiTie)
    }
    return (
        <View style={[styles.container, { position: "absolute", zIndex: 10, }]}>
            {/* 火焰 */}
            <Animated.View style={{
                position: 'absolute',
                zIndex: 10,
                bottom: bottom,
                width: box_width,
                backgroundColor: 'red'
            }}>
                <HuoYanAnimation />
            </Animated.View>
            {/* 遮罩 */}
            <View style={{ flex: 1, overflow: 'hidden' }}>
                <Animated.View style={{
                    width: box_width,
                    height: box_width,
                    backgroundColor: '#E9E7E1',
                    transform: [{ translateY: translateY }]
                }} />
            </View>
        </View>
    )
}

const CopyBook = (props) => {
    // 用于更新页面
    const [lastX, setLastX] = useState(0)

    // 火焰显示
    let isShowHuoYan = useRef(false)
    // 字帖索引
    const ziTieIndex = useRef(0)
    // 所有移动位置
    const MousePositions = useRef([])
    // svg 移动路径
    const path = useRef("")
    // 字帖数据
    const { word } = props

    if (word === undefined) return null

    // 字帖显示
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const currentZiTieArr = word.map((item) => {
        for (let index = 0; index < ziTieArr.length; index++) {
            if (item === ziTieArr[index].name) {
                return ziTieArr[index]
            }
        }
    })

    let ziTie = useRef(currentZiTieArr).current

    const strokes = useRef(0)  // 笔画次数
    const failuresNumber = 3  // 可以失败次数
    const curFailuresNumber = useRef(0)  // 当前失败次数

    // 起点的 X 坐标
    let firstX = 0

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            //激活时做的动作
            onPanResponderGrant: (evt, gestureState) => {
                // 手指按下时的画笔起点坐标
                firstX = evt.nativeEvent.locationX
                const firstY = evt.nativeEvent.locationY

                path.current = `M${firstX} ${firstY}`
            },

            // 移动时作出的动作
            onPanResponderMove: (evt, gestureState) => {
                // 单指
                if (gestureState.numberActiveTouches === 1) {
                    const { locationX, locationY, pageX, pageY } = evt.nativeEvent;

                    if (pageY > scopeTop && pageY < scopeBottom && pageX > scopeLeft && pageX < scopeRight) {
                        path.current += ` L${locationX} ${locationY}`

                        const detectionArea = ziTie[ziTieIndex.current].detectionArea

                        for (let index = 0; index < detectionArea.length; index++) {
                            if ((locationX >= detectionArea[index].origin[0] && locationX <= (detectionArea[index].origin[0] + detectionArea[index].width))
                                && (locationY >= detectionArea[index].origin[1] && locationY <= (detectionArea[index].origin[1] + detectionArea[index].height))) {
                                detectionArea[index].status = true
                            }
                        }

                        //更新界面
                        setLastX(firstX + gestureState.dx)
                    }
                    return
                }
            },

            // 动作释放后做的动作
            onPanResponderRelease: (evt, gestureState) => {
                MousePositions.current.push(path.current)
                const status = statusHandler()
                if (status === false) {
                    strokes.current += 1
                    if (strokes.current >= ziTie[ziTieIndex.current].strokes) {
                        curFailuresNumber.current += 1
                        if (curFailuresNumber.current >= failuresNumber) {
                            Toast.show("过关失败")
                            onClear()
                            props.onClose(false)
                        } else {
                            Toast.show("还差一点点!!!,重新开始")
                            strokes.current = 0
                            onClear()
                        }
                    }
                }
                // setLastX(0)
            },
        })
    ).current

    const statusHandler = () => {
        const isOk = ziTie[ziTieIndex.current].detectionArea.every((item) => {
            if (item.status === undefined || item.status === false) return false
            if (item.status === true) return true
        })

        if (isOk) {
            Toast.show("过关")
            isShowHuoYan.current = true
            onClear()
        }

        return isOk
    }

    // 下一个字帖
    const nextZiTie = () => {
        if (ziTieIndex.current < ziTie.length - 1) {
            ziTieIndex.current += 1
            isShowHuoYan.current = false
            strokes.current = 0
            curFailuresNumber.current = 0
            onClear()
        }
        else {
            onClear()
            props.onClose(true)
        }
    }

    // 清除
    const onClear = () => {
        MousePositions.current = []
        path.current = ""
        for (let index = 0; index < ziTie[ziTieIndex.current].detectionArea.length; index++) {
            ziTie[ziTieIndex.current].detectionArea[index].status = false;
        }
        setLastX(null)
    }

    const onFinish = () => {
        const isOk = statusHandler()
        if (!isOk) {
            Toast.show("还差一点点!!!,重新开始")
            onClear()
        }
    }

    useEffect(() => {
        return () => {
            onClear()
        }
    }, [])

    return (
        <View style={styles.viewContainer} >
            <View style={{ width: '90%', height: '80%', borderRadius: 10, overflow: 'hidden', backgroundColor: "#ccc", justifyContent: "center", alignItems: 'center' }}>
                <Text style={styles.title}>字帖</Text>

                <View style={styles.imgBg}>
                    <FastImage style={{ width: px2pd(928), height: px2pd(1492), position: "absolute", }} source={require('../../../assets/games/ziTie/bg.webp')} />
                    <Animated.View style={[styles.container, { backgroundColor: "#fff", opacity: fadeAnim }]}>
                        {/* 字帖背景 */}
                        <View style={[styles.container, { position: "absolute", zIndex: 0 }]}>
                            <Image style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 2, opacity: 0.5 }} source={ziTie[ziTieIndex.current].img} />
                            <Image style={{ width: "100%", height: "100%", position: 'absolute', zIndex: 1 }} source={require('../../../assets/games/ziTie/ziTie_bg.webp')} />
                        </View>

                        {/* 字帖 begin */}
                        <View style={[styles.container, { position: "absolute", zIndex: 1, }]}>
                            {
                                MousePositions.current.map((item, index) => {
                                    return (
                                        <View key={index} style={[styles.container, { position: "absolute", zIndex: index, }]}>
                                            <Svg height={box_width} width={box_width}>
                                                <Path
                                                    d={item}
                                                    stroke="red"
                                                    fill="none"
                                                    strokeWidth={"3"}
                                                />
                                            </Svg>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View style={[styles.container, { zIndex: 999 }]} {...panResponder.panHandlers} >
                            <Svg height={box_width} width={box_width}  >
                                <Path
                                    d={path.current}
                                    stroke="red"
                                    fill="none"
                                    strokeWidth={"3"}
                                />
                            </Svg>
                        </View>
                        {/* 字帖 end */}

                        {/* 火焰 */}
                        {isShowHuoYan.current ? <HuoYna nextZiTie={nextZiTie} /> : null}
                    </Animated.View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginBottom: 12, }}>
                    <TextButton title={"退出"} onPress={props.onClose} />
                    <TextButton title={"清除"} onPress={onClear} />
                    <TextButton title={"确认"} onPress={onFinish} />
                </View>

            </View>
        </View >
    )
}

export default CopyBook

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%",
        width: "100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 99,
    },
    imgBg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: box_width,
        height: box_width,
    },
    title: {
        fontSize: 24,
        color: "#000",
        marginTop: 12,
    },
});

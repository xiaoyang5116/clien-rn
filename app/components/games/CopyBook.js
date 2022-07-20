import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PanResponder,
    Image
} from 'react-native';

import Svg, { Path, } from 'react-native-svg'

import { statusBarHeight } from '../../constants'
import { TextButton } from '../../constants/custom-ui';
import Toast from '../toast'



//获取屏幕的宽高
const { width, height } = Dimensions.get('window');

const ziTieArr = [
    {
        id: 0, img: require('../../../assets/ziTie/mu.png'), detectionArea: [
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
        id: 1, img: require('../../../assets/ziTie/xian.png'), detectionArea: [
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
    }
]

const box_width = 300
const scopeLeft = (width - box_width) / 2
const scopeRight = scopeLeft + box_width
const scopeTop = ((height - box_width) / 2) + statusBarHeight
const scopeBottom = scopeTop + box_width


const CopyBook = (props) => {
    // 用于更新页面
    const [lastX, setLastX] = useState(0)
    // 字帖索引
    const ziTieIndex = useRef(0)
    // 所有移动位置
    const MousePositions = useRef([])
    // svg 移动路径
    const path = useRef("")
    // 字帖数据
    let ziTie = useRef([...ziTieArr]).current

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

                    if (scopeLeft > pageX) return
                    if (scopeRight < pageX) return
                    if (scopeTop > pageY) return
                    if (scopeBottom < pageY) return

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
            },

            // 动作释放后做的动作
            onPanResponderRelease: (evt, gestureState) => {
                MousePositions.current.push(path.current)
                statusHandler()
                setLastX(0)
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
            if (ziTieIndex.current < ziTie.length - 1) {
                onClear()
                ziTieIndex.current += 1
            }
            else {
                onClear()
                props.onClose()
            }
        }
        return isOk
    }

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
            <View style={{ width: '90%', height: '80%', borderRadius: 10, overflow: 'hidden', backgroundColor: "#ccc", justifyContent: "space-between", alignItems: 'center' }}>
                <Text style={styles.title}>字帖</Text>

                <View style={[styles.container, { backgroundColor: "#fff", }]}>
                    <View style={[styles.container, { position: "absolute", zIndex: 0 }]}>
                        <Image style={{ width: "100%", height: "100%" }} source={ziTie[ziTieIndex.current].img} />
                    </View>
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
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                    <TextButton title={"退出"} onPress={props.onClose} />
                    <TextButton title={"清除"} onPress={onClear} />
                    <TextButton title={"确认"} onPress={onFinish} />
                </View>

            </View>
        </View>
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
    container: {
        width: box_width,
        height: box_width,
    },
    title: {
        fontSize: 24,
        color: "#000",
    },
});

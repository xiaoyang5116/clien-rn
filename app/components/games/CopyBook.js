import React, { PureComponent, Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    // ART,
    Dimensions,
    PanResponder,
    FlatList
} from 'react-native';

import Svg, { Path, } from 'react-native-svg'

import { statusBarHeight } from '../../constants'
import { TextButton } from '../../constants/custom-ui';
import { HalfPanel } from '../panel';



//获取屏幕的宽高
const { width, height } = Dimensions.get('window');


const box_width = 300
const scopeLeft = (width - box_width) / 2
const scopeRight = scopeLeft + box_width
const scopeTop = ((height - box_width) / 2) + statusBarHeight
const scopeBottom = scopeTop + box_width

export default class CopyBook extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            //用于更新界面
            lastX: 0,

        };

        // //每次移动的临时数组
        // this.MousePosition = {
        //     firstX: 0, //起点 X 坐标
        //     firstY: 0,// 起点 Y 坐标
        //     x: 0,   //经过路径的x坐标
        //     y: 0    //经过路径的y坐标
        // }
        // //path 全部路径数组
        // this.MousePositions = []

        this.MousePosition = []
        //path 全部路径数组
        this.MousePositions = []

        this.path = ""
    }


    _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return true;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return true;
        },

        //激活时做的动作
        onPanResponderGrant: (evt, gestureState) => {
            // 手指按下时的画笔起点坐标
            this.tempFirstX = evt.nativeEvent.locationX
            this.tempFirstY = evt.nativeEvent.locationY

            const M = `M${this.tempFirstX} ${this.tempFirstY}`
            this.path = M
        },

        // 移动时作出的动作
        onPanResponderMove: (evt, gestureState) => {
            // 单指
            if (gestureState.numberActiveTouches === 1) {
                let currentX = evt.nativeEvent.locationX
                let currentY = evt.nativeEvent.locationY

                if (scopeLeft > evt.nativeEvent.pageX) return
                if (scopeRight < evt.nativeEvent.pageX) return
                if (scopeTop > evt.nativeEvent.pageY) return
                if (scopeBottom < evt.nativeEvent.pageY) return

                this.path += ` L${currentX} ${currentY}`

                //更新界面
                this.setState({
                    lastX: this.tempFirstX + gestureState.dx,
                })

            }
        },

        // 动作释放后做的动作
        onPanResponderRelease: (evt, gestureState) => {
            this.MousePositions.push(this.path)
            // this.path = ""
            // console.log("结束",this.path);
            this.setState({
                lastX: 0,
            })
        },
        onPanResponderTerminate: (evt, gestureState) => {
            console.log("ssss");
        },
    });

    renderSVG = ({ item, index }) => {
        console.log("item", item, index);
        return (
            <View style={[styles.container, { position: "absolute", zIndex: 99, backgroundColor: "pink" }]}>
                <Text>{item}</Text>
                {/* <Svg height={box_width} width={box_width} >
                    <Path
                        d={item}
                        stroke="red"
                        fill="none"
                        strokeWidth={"3"}
                    />
                </Svg> */}
            </View>
        )
    }

    render() {
        // "height": 300.19049072265625, "width": 300.19049072265625, "x": 35.0476188659668, "y": 130.6666717529297
        return (
            <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
                <View style={{ flex: 1, backgroundColor: "#ccc", justifyContent: "space-between", alignItems: 'center' }}>
                    <Text style={styles.title}>字帖</Text>

                    <View style={[styles.container, { backgroundColor: "#fff", }]}>
                        <View style={[styles.container, { position: "absolute", zIndex: 1, }]}>
                            {
                                this.MousePositions.map((item, index) => {
                                    return (
                                        <View key={index} style={[styles.container, { position: "absolute", zIndex: index, }]}>
                                            <Svg height={box_width} width={box_width} >
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
                        <View
                            style={[styles.container, { zIndex: 999 }]}
                            {...this._panResponder.panHandlers}
                        >
                            <Svg height={box_width} width={box_width}  >
                                <Path
                                    d={this.path}
                                    stroke="red"
                                    fill="none"
                                    strokeWidth={"3"}
                                />
                            </Svg>
                        </View>
                    </View>

                    <TextButton title={"退出"} onPress={this.props.onClose} />
                </View>
            </HalfPanel>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: box_width,
        height: box_width,
        // overflow: "hidden",
        // justifyContent: "center",
        // alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: "#000",
    },
});

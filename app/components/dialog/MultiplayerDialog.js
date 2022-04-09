import React, { useState, useEffect, useRef, createRef } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Image,
} from 'react-native'
import {
    action,
    connect,
    getAvatar
} from "../../constants";
import TextAnimation from '../textAnimation'
import { TextButton } from '../../constants/custom-ui';


// 获取头像路径
function changeAvatar(avatar) {
    const avatarList = [
        { id: "1", img: require('../../../assets/avatar/1.jpg'), },
        { id: "2", img: require('../../../assets/avatar/2.jpg'), },
    ]
    return avatarList.find(a => a.id === avatar).img
}

// 思路：历史对话 => 当前对话 => 点击之后，就当前的对话，push 到历史对话中 => 显示历史对话
const MultiplayerDialog = (props) => {
    // 样式， 配置数据， 关闭对话框方法
    const { currentStyles, viewData, onDialogCancel } = props;
    //文字动画类型
    const textAnimationType = viewData.textAnimationType;

    // FlatList
    const refFlatList = React.createRef();

    // 历史对话
    const [historyDialogData, setHistoryDialogData] = useState([]);

    // 当前对话数据
    const [currentDialogData, setCurrentDialogData] = useState(viewData.sections[0])
    // 当前对话数据的索引
    const [currentDialogIndex, setCurrentDialogIndex] = useState(0)

    // 当前内容
    const currentData = currentDialogData.dialog[currentDialogIndex]
    // 当前内容的索引
    const [currentContentIndex, setCurrentContentIndex] = useState(0)
    // 当前对话内容的长度
    const currentContentLength = currentData.content.length - 1

    // 所有人物的信息
    const figureInfo = props.figureList

    // 添加历史对话
    const addHistoryDialog = (dialogData) => {
        setHistoryDialogData([...historyDialogData, dialogData])
    }

    useEffect(() => {
        // 获取所有人物信息
        if (props.figureList.length === 0) {
            props.dispatch(action('FigureModel/getFigureList')());
        }

        // 初始化对话
        if (currentData.content.length > 0) {
            const currentDialogContent = currentData.content[0]
            addHistoryDialog({ id: currentData.id, content: currentDialogContent })
        }
    }, [])

    // 点击下一段
    const nextParagraph = () => {
        // 滚动到 FlatList 底部
        // refFlatList.current.scrollToEnd({ animated: false })

        // 判断当前内容是否有下一段
        if (currentContentIndex < currentContentLength) {
            // console.log("length", currentContentIndex, currentContentLength);
            console.log("currentContentIndex+1");
            const currentDialogContent = currentData.content[currentContentIndex + 1]
            addHistoryDialog({ id: currentData.id, content: currentDialogContent })
            setCurrentContentIndex(currentContentIndex + 1)
        }
        // 判断当前对话是否有下一段
        if ((currentContentIndex === currentContentLength) && currentDialogIndex < currentDialogData.dialog.length - 1) {
            addHistoryDialog({ id: currentDialogData.dialog[currentDialogIndex + 1].id, content: currentDialogData.dialog[currentDialogIndex + 1].content[0] })
            setCurrentDialogIndex(currentDialogIndex + 1)
            setCurrentContentIndex(0)
        }
    }

    //  点击按钮
    const nextDialog = (tokey) => {
        const newDialogData = viewData.sections.filter(s => s.key === tokey)
        if (newDialogData.length > 0) {
            addHistoryDialog({ id: newDialogData[0].dialog[0].id, content: newDialogData[0].dialog[0].content[0] })
            setCurrentDialogIndex(0)
            setCurrentContentIndex(0)
            setCurrentDialogData(newDialogData[0])
        }
        else {
            onDialogCancel()
        }

    }

    // 渲染对话
    const renderDialog = ({ item }) => {
        if (figureInfo.length > 0) {
            // 当前说话人的信息
            const figure = figureInfo.find(f => f.id === item.id)
            return (
                <TouchableWithoutFeedback onPress={nextParagraph} >
                    <View style={{ flexDirection: item.id === '01' ? 'row-reverse' : 'row', justifyContent: 'flex-start', flexWrap: 'nowrap', marginTop: 18, }}>
                        <View>
                            <Image source={changeAvatar(figure.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                        </View>
                        <View style={item.id === '01' ? styles.paddingRight : styles.paddingLeft}>
                            <Text style={{ textAlign: item.id === '01' ? 'right' : 'left' }}>
                                {figure.name}
                            </Text>
                            <View style={{ maxWidth: 270, padding: 5, backgroundColor: "#fff", borderRadius: 4, position: 'relative' }}>
                                <View style={item.id === '01' ? styles.tipRightTriangle : styles.tipLeftTriangle}></View>
                                <TextAnimation
                                    fontSize={18}
                                    type={textAnimationType}
                                >
                                    {item.content}
                                </TextAnimation>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }

    }

    // 渲染按钮
    const renderBtn = ({ item }) => {
        if ((currentDialogIndex === currentDialogData.dialog.length - 1) && (currentContentIndex === currentContentLength)) {
            return (
                <View style={{ marginTop: 12 }}>
                    <TextButton currentStyles={props.currentStyles} title={item.title} onPress={() => { nextDialog(item.tokey) }} />
                </View>
            )
        }
    }

    return (
        <View style={styles.fullscreenContainer}>
            <View style={[styles.halfContainer, currentStyles.bgColor]}>
                {/* header */}
                <View style={styles.dialogHeader}>
                    <Text onPress={onDialogCancel} style={[styles.titleFontSize, styles.back]}>返回</Text>
                    <Text style={[styles.titleFontSize, styles.title]}>{viewData.title}</Text>
                    <Text style={[styles.titleFontSize, styles.multifunction]}>多功能</Text>
                </View>
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{
                        flex: 1,
                        paddingLeft: 12,
                        paddingRight: 12,
                    }}>
                        {/* content */}
                        <View style={{ width: "100%", height: '70%' }} >
                            <FlatList
                                ref={refFlatList}
                                data={historyDialogData}
                                renderItem={renderDialog}
                                keyExtractor={(item, index) => item + index}
                                onContentSizeChange={() => {
                                    if (historyDialogData.length > 0) {
                                        refFlatList.current.scrollToEnd({ animated: true })
                                    }
                                }}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View style={{ marginTop: 12 }}>
                            <FlatList
                                data={currentDialogData.btn}
                                renderItem={renderBtn}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}
export default connect((state) => ({ ...state.FigureModel }))(MultiplayerDialog)

const styles = StyleSheet.create({
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    fullContainer: {
        flex: 1,
        width: '100%',
    },
    halfContainer: {
        width: 360,
        height: 600,
    },
    dialogHeader: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#6a655e',
        borderBottomWidth: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    back: {
        textAlign: 'left',
        flex: 1,
    },
    title: {
        textAlign: 'center',
        flex: 2,
    },
    multifunction: {
        textAlign: 'right',
        flex: 1,
    },
    paddingLeft: {
        paddingLeft: 12,
    },
    paddingRight: {
        paddingRight: 12,
    },
    tipLeftTriangle: {
        position: "absolute",
        left: -7,
        top: 8,
        height: 0,
        width: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: 8,
        borderRightColor: '#fff',
        borderRightWidth: 8,
    },
    tipRightTriangle: {
        position: "absolute",
        right: -7,
        top: 8,
        height: 0,
        width: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: 8,
        borderLeftColor: '#fff',
        borderLeftWidth: 8,
    },
    titleFontSize: {
        fontSize: 20,
    }
});
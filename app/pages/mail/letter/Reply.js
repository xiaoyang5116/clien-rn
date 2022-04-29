import {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import {
    action,
    connect,
    changeAvatar,
    ThemeContext
} from "../../../constants";
import MailPanel from '../components/MailPanel';

const Reply = (props) => {
    const theme = React.useContext(ThemeContext);
    /**
    * currentStyles: 主题样式
    * onClose: 关闭弹窗
    * figureList: 人物列表
    * mailConfigData: 邮件配置数据
    * currentFigureId: 当前人物id
    * currentMailId: 当前邮件id
    * currentKey: 当前邮件key
    */
    const { currentStyles, onClose, figureList, mailConfigData, currentFigureId, currentMailId, currentKey } = props;
    // 当前邮件配置数据
    const currentMailConfigData = mailConfigData.find(m => m.mailId === currentMailId).mail.find(f => f.key === currentKey);
    // 是否显示确认回复弹窗
    const [confirm, setConfirm] = useState(false)
    // 确认弹窗信息
    const [confirmInfo, setConfirmInfo] = useState({})
    // 当前人物信息
    const figureInfo = figureList.find(f => f.id === currentFigureId);


    // 回信选择
    const replyOption = () => {
        props.dispatch(action('MailBoxModel/replyLetter')(confirmInfo));
        onClose()
    }
    // 确认回信弹窗
    const confirmReply = (item) => {
        setConfirmInfo(item)
        setConfirm(true)
    }

    // 渲染按钮
    const renderBtn = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { confirmReply(item) }}>
                <View style={[theme.blockBgColor2, { marginTop: 12, borderRadius: 12, padding: 12, justifyContent: 'center' }]}>
                    <Text style={[theme.contentColor3, { fontSize: 18 }]}>{item.content}</Text>
                    <Text style={[theme.contentColor3, { fontSize: 18 }]}>{item.tokey === 'finish' ? '来信流程结束' : "预计耗时" + item.nextTime + "s"}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <MailPanel onClose={onClose}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* head */}
                    <View style={[theme.blockBgColor1, { height: 50, alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[theme.titleColor1, { fontSize: 24 }]}>给它回信</Text>
                    </View>
                    {/* 内容 */}
                    <View style={[theme.blockBgColor1, { height: 175, marginTop: 12, marginLeft: 18, marginRight: 18, borderRadius: 10, paddingLeft: 15, paddingRight: 15, }]}>
                        <View style={{ height: 80, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', }}>
                            <View>
                                <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                            </View>
                            <View>
                                <Text style={[theme.titleColor3, { fontSize: 20, marginLeft: 8 }]}>{figureInfo.name}</Text>
                                <Text style={[theme.titleColor2, { fontSize: 14, marginLeft: 8 }]}>请选择回信内容!</Text>
                            </View>
                        </View>
                        <ScrollView>
                            <Text type={'TextSingle'} style={[theme.contentColor3, { fontSize: 18, paddingBottom: 12, paddingRight: 15, }]} >
                                {currentMailConfigData.content}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
                <View style={{ flex: 1, marginLeft: 18, marginRight: 18, }}>
                    <Text style={[theme.titleColor3, { fontSize: 24, marginTop: 12 }]}>请选择一项</Text>
                    <View>
                        <FlatList
                            data={currentMailConfigData.btn}
                            renderItem={renderBtn}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>
                </View>
            </View>

            {/* 确认弹窗 */}
            {
                confirm && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(102, 102, 102, 0.5)", }}>
                            <View style={[theme.blockBgColor1, {
                                width: "100%",
                                height: 350,
                                position: 'relative',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }]}>
                                <View style={[theme.blockBgColor2, { position: 'absolute', top: 0, height: 50, width: '100%', alignItems: 'center', justifyContent: 'center', }]}>
                                    <Text style={[theme.titleColor2, { fontSize: 24 }]}>回信内容</Text>
                                </View>
                                <View style={[theme.blockBgColor2, { height: 150, width: 340, justifyContent: 'center', alignItems: 'center', }]}>
                                    <Text style={[theme.contentColor2, { fontSize: 18 }]}>
                                        {confirmInfo.content}
                                    </Text>
                                    <Text style={{ fontSize: 18, color: "#7690d2", marginTop: 4 }}>(预计{confirmInfo.nextTime}秒后，访客再次来信)</Text>
                                </View>
                                <View style={{ position: 'absolute', bottom: 0, height: 60, width: "100%", flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={replyOption}>
                                        <View style={{ height: 40, width: 140, backgroundColor: "#9fc8c8", justifyContent: 'center', alignItems: 'center', borderRadius: 5, }}>
                                            <Text style={{ fontSize: 18 }}>就这样</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setConfirm(false) }}>
                                        <View style={{ height: 40, width: 140, backgroundColor: "#edbb9a", justifyContent: 'center', alignItems: 'center', borderRadius: 5, }}>
                                            <Text style={{ fontSize: 18, }}>再想想</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    </View>
                )
            }
        </MailPanel>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(Reply)

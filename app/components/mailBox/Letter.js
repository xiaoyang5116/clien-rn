import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import { TextButton } from '../../constants/custom-ui';
import {
    action,
    connect,
} from "../../constants";
import { changeAvatar } from '../../constants'


const Letter = (props) => {

    /**
     * currentStyles: 主题样式
     * onClose: 关闭弹窗
     * figureList: 人物列表
     * mailHistoryData: 邮件历史数据
     * mailConfigData: 邮件配置数据
     * id: 发件人id
     */
    const { currentStyles, onClose, figureList, mailHistoryData, mailConfigData, id } = props;
    const figureInfo = figureList.find(f => f.id === id);

    useEffect(() => {
        // if (figureList.length === 0) {
        //     props.dispatch(action('FigureModel/getFigureList')());
        // }
        // if (props.mailConfigData.length === 0) {
        //     props.dispatch(action('MailBoxModel/getMailConfigData')());
        // }
    }, [])

    return (
        <View style={styles.mailBox}>
            <View style={[currentStyles.bgColor, {
                width: 360,
                height: 500,
            }]}>
                {/* head */}
                <View style={{ height: 50, backgroundColor: '#e3d5c1', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>{figureInfo.name}来信</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {/* 新信件 */}
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
                            <Text style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 24, paddingRight: 24, textAlign: 'center', fontSize: 14, backgroundColor: '#d3c2aa', borderRadius: 12, }}>你收到了一封新信笺！</Text>
                        </View>
                        <View style={{ height: 80, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#e8d2b0', marginLeft: 18, marginRight: 18, borderRadius: 10, paddingLeft: 15 }}>
                            <View>
                                <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 18, marginLeft: 8, color: '#d86362' }}>新信笺！</Text>
                                <Text style={{ fontSize: 14, marginLeft: 8 }}>请点击信笺，阅读内容~</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* 返回 */}
            <View style={{ width: 360, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View></View>
                <TextButton style={{ width: 100 }} currentStyles={currentStyles} title={"返回"} onPress={onClose} />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(Letter)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        // backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
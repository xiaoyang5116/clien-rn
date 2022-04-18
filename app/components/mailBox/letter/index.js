import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import { TextButton } from '../../../constants/custom-ui';
import {
    action,
    connect,
} from "../../../constants";
import RootView from '../../RootView'
import NewLetter from './NewLetter'
import HistoryLetter from './HistoryLetter';
import Reply from './Reply';


const Letter = (props) => {

    /**
     * currentStyles: 主题样式
     * onClose: 关闭弹窗
     * figureList: 人物列表
     * mailHistoryData: 邮件历史数据
     * mailConfigData: 邮件配置数据
     * figureId: 当前人物id
     * currentKey: 当前邮件key
     * currentMailData: 当前邮件数据
     * currentIsFinish: 当前邮件是否完成
     * id: 发件人id
     */
    const { currentStyles, onClose, figureList, mailHistoryData, mailConfigData, figureId, currentKey, currentMailData, currentIsFinish } = props;

    // 当前人物信息
    const figureInfo = figureList.find(f => f.id === figureId);

    useEffect(() => {

    }, [])

    // 打开信件
    const openLetter = (key) => {
        props.dispatch(action('MailBoxModel/openLetter')({ key }));
    }

    // 回信
    const replyLetter = () => {
        const key = RootView.add(<Reply onClose={() => { RootView.remove(key) }} />);
    }

    // 信件
    const renderMail = ({ item }) => {
        switch (item.status) {
            case 'receive':
                return <NewLetter item={item} figureInfo={figureInfo} openLetter={openLetter} replyLetter={replyLetter} />
            case 'reply':
                return <HistoryLetter item={item} figureInfo={figureInfo} />
        }
    }

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
                    <FlatList
                        data={currentMailData}
                        renderItem={renderMail}
                        keyExtractor={(item, index) => item + index}
                        ListFooterComponent={() => <View style={{ height: 18 }} />}
                        showsVerticalScrollIndicator={false}  // 隐藏滚动条
                    />
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
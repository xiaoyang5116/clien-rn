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
     * figureId: 当前人物id
     * hideMailBoxPage: 隐藏邮箱页面
     */
    const { currentStyles, onClose, figureList, mailHistoryData, figureId, hideMailBoxPage } = props;

    // 当前人物信息
    const figureInfo = figureList.find(f => f.id === figureId);

    // 当前信件数据
    const mailData = mailHistoryData.find(m => m.id === figureId);

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
                    <Text style={{ fontSize: 24 }}>{mailData.title}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={mailData.historyData}
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
                <TextButton style={{ width: 100 }} currentStyles={currentStyles} title={"返回"} onPress={() => {
                    onClose()
                    hideMailBoxPage(false)
                }} />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(Letter)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
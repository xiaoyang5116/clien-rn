import {
    View,
    Text,
    FlatList,
} from 'react-native'
import React from 'react'

import {
    action,
    connect,
    ThemeContext
} from "../../../constants";
import MailPanel from '../components/MailPanel';
import RootView from '../../../components/RootView'
import NewLetter from './NewLetter'
import HistoryLetter from './HistoryLetter';
import Reply from './Reply';


const Letter = (props) => {
    const theme = React.useContext(ThemeContext);
    /**
     * onClose: 关闭弹窗
     * figureList: 人物列表
     * mailHistoryData: 邮件历史数据
     * currentFigureId: 当前人物id
     * currentMailId: 当前邮件id
     * hideMailBoxPage: 隐藏邮箱页面
     */
    const { onClose, figureList, mailHistoryData, currentFigureId, currentMailId, hideMailBoxPage } = props;

    // 当前人物信息
    const figureInfo = figureList.find(f => f.id === currentFigureId);

    // 当前信件数据
    const mailData = mailHistoryData.find(m => m.mailId === currentMailId);

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
        <MailPanel style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClose={() => {
                onClose()
                hideMailBoxPage(false)
            }}>
            {/* head */}
            <View style={[theme.rowCenter, theme.blockBgColor1, { height: 50, }]}>
                <Text style={[theme.titleColor1, theme.headerTitle1]}>{mailData.title}</Text>
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
        </MailPanel>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(Letter)

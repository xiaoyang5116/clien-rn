import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import {
    action,
    connect,
} from "../../constants";
import {
    changeAvatar,
    ThemeContext
} from '../../constants'
import RootView from '../../components/RootView'
import Letter from './letter';
import { formatDateTime } from '../../utils/DateTimeUtils';

const CompletedMailPage = (props) => {
    const theme = React.useContext(ThemeContext);
    /**
    * currentStyles: 主题样式
    * figureList: 人物列表
    * mailHistoryData: 邮件历史数据
    * hideMailBoxPage: 隐藏邮箱页面
    */
    const { figureList, mailHistoryData, hideMailBoxPage } = props;

    useEffect(() => {
        if (figureList.length === 0) {
            props.dispatch(action('FigureModel/getFigureList')());
        }
        if (props.mailConfigData.length === 0) {
            props.dispatch(action('MailBoxModel/getMailConfigData')());
        }
    }, [])

    // 信件
    const letter = (item) => {
        hideMailBoxPage(true)
        props.dispatch(action('MailBoxModel/changeCurrentMailData')(item));
        const key = RootView.add(<Letter onClose={() => { RootView.remove(key) }} hideMailBoxPage={hideMailBoxPage} />);
    }

    const renderMail = ({ item }) => {
        if (item.isFinish) {
            // 当前人物信息
            const figureInfo = figureList.find(f => f.id === item.figureId);
            if (figureInfo !== undefined) {
                return (
                    <View style={{ flex: 1, marginLeft: 30, marginRight: 30, marginBottom: 12 }}>
                        <TouchableOpacity onPress={() => { letter(item) }}>
                            <View style={{ paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gray", flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <View>
                                    <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                                </View>
                                <View styles={{}}>
                                    <Text style={[theme.contentColor2, { fontSize: 18, marginLeft: 12 }]}>{figureInfo.name}</Text>
                                    <Text style={[theme.contentColor2, { fontSize: 14, marginLeft: 12 }]}>{formatDateTime(item.historyData[0].time)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }
    return (
        <View style={{ flex: 1, }}>
            {/* head */}
            <View style={[theme.blockBgColor1, { marginBottom: 24, paddingBottom: 8, paddingTop: 8, paddingLeft: 12, alignItems: 'flex-start', }]}>
                <Text style={[theme.titleColor1, theme.headerTitle1]}>已完成信件</Text>
                <Text style={[theme.titleColor2, theme.headerTitle2]}>共有{mailHistoryData.filter(m => m.isFinish === true).length}位来访者</Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={mailHistoryData}
                    renderItem={renderMail}
                    keyExtractor={(item, index) => item + index}
                    ListFooterComponent={() => <View style={{ height: 18 }} />}
                    showsVerticalScrollIndicator={false}  // 隐藏滚动条
                />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(CompletedMailPage)
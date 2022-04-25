import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TextButton } from '../../constants/custom-ui';
import {
    action,
    connect,
} from "../../constants";
import { changeAvatar } from '../../constants'
import RootView from '../RootView'
import Letter from './letter';
import { formatDateTime, timeDiff, now } from '../../utils/DateTimeUtils';


const CompletedLetter = (props) => {
    /**
 * currentStyles: 主题样式
 * figureList: 人物列表
 * mailHistoryData: 邮件历史数据
 * hideMailBoxPage: 隐藏邮箱页面
 */
    const { currentStyles, figureList, mailHistoryData, hideMailBoxPage } = props;

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
        props.dispatch(action('MailBoxModel/changeCurrentFigureMailData')(item));
        const key = RootView.add(<Letter onClose={() => { RootView.remove(key) }} hideMailBoxPage={hideMailBoxPage} />);
    }

    const renderMail = ({ item }) => {
        if (item.isFinish) {
            // 当前人物信息
            const figureInfo = figureList.find(f => f.id === item.figureId);
            if (figureInfo !== undefined) {
                return (
                    <View style={{ flex: 1, marginLeft: 30, marginRight: 30,marginBottom:12 }}>
                        <TouchableOpacity onPress={() => { letter(item) }}>
                            <View style={{ paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "gray", flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <View>
                                    <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 50, width: 50, borderRadius: 5 }} />
                                </View>
                                <View styles={{ }}>
                                    <Text style={{ fontSize: 18,marginLeft:12 }}>{figureInfo.name}</Text>
                                    <Text style={{ fontSize: 14,marginLeft:12 }}>{formatDateTime(item.historyData[0].time)}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }
    return (
        <View style={styles.mailBox}>
            <View style={[currentStyles.bgColor, {
                width: 360,
                height: 550,
            }]}>
                {/* head */}
                <View style={{ marginBottom: 12, paddingBottom: 8, paddingTop: 8, paddingLeft: 12, backgroundColor: '#e3d5c1', alignItems: 'flex-start', }}>
                    <Text style={{ fontSize: 24 }}>已完成信件</Text>
                    <Text style={{ fontSize: 18 }}>共有{mailHistoryData.filter(m => m.isFinish === true).length}位来访者</Text>
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
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(CompletedLetter)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
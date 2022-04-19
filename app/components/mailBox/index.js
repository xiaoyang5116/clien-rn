import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TextButton } from '../../constants/custom-ui';
import {
    action,
    connect,
} from "../../constants";
import MailBox from './MailBox'
import CompletedLetter from './CompletedLetter'


const MailBoxPage = (props) => {

    /**
     * currentStyles: 主题样式
     * onClose: 关闭弹窗
     * figureList: 人物列表
     * mailHistoryData: 邮件历史数据
     * mailConfigData: 邮件配置数据
     */
    const { currentStyles, onClose, figureList, mailHistoryData, mailConfigData } = props;
    const [currentTab, setCurrentTab] = useState('MailBox')
    const [isHide, setIsHide] = useState(false)


    return (
        <View style={[styles.mailBox]}>
            <View style={[currentStyles.bgColor, {
                width: 360,
                height: 500,
                position: "relative",
            }]}>
                {currentTab === 'MailBox' ? <MailBox hideMailBoxPage={setIsHide} /> : <CompletedLetter hideMailBoxPage={setIsHide} />}
                <View style={{
                    position: 'absolute',
                    bottom: -30,
                    height: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: isHide ? 'none' : 'flex',
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrentTab('MailBox')
                        }}
                        style={{ width: 60, height: 50, backgroundColor: currentTab === 'MailBox' ? "#003964" : "#e8ddcc", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{}}>
                            <Text style={{ color: currentTab === 'MailBox' ? "#fff" : '#868076' }}>新信件</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setCurrentTab('CompletedLetter')
                        }}
                        style={{ width: 60, height: 50, backgroundColor: currentTab === 'CompletedLetter' ? "#003964" : "#e8ddcc", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20, }}>
                        <View style={{}}>
                            <Text style={{ color: currentTab === 'CompletedLetter' ? "#fff" : '#868076' }}>已完成</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: 360, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View></View>
                <TextButton style={{ width: 100 }} currentStyles={currentStyles} title={"返回"} onPress={onClose} />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(MailBoxPage)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
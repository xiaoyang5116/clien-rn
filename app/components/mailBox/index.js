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
    const Tab = createBottomTabNavigator();

    return (
        <View style={styles.mailBox}>
            <View style={[currentStyles.bgColor, {
                width: 360,
                height: 500,
                position: "relative",
            }]}>
                <NavigationContainer>
                    <Tab.Navigator screenOptions={()=>{
                    }}>
                        <Tab.Screen name="新信笺" options={{ headerShown: false,tabBarBadge: '' }} component={MailBox} />
                        <Tab.Screen name="已完成信件" options={{ headerShown: false }} component={CompletedLetter} />
                    </Tab.Navigator>
                </NavigationContainer>
                <View style={{
                    position: 'absolute',
                    bottom: -30,
                    height: 50,
                    // width:100,
                    // backgroundColor: 'pink',
                    flexDirection: 'row',

                }}>
                    <View style={{ backgroundColor: "pink", height: 50, width: 50 }}>
                        <Text>新信件</Text>
                    </View>
                    <View>
                        <Text>已完成</Text>
                    </View>
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
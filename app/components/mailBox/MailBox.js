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
import RootView from '../RootView'
import Letter from './letter';


const MailBox = (props) => {

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
        props.dispatch(action('MailBoxModel/changeCurrentMailData')(item));
        const key = RootView.add(<Letter onClose={() => { RootView.remove(key) }} hideMailBoxPage={hideMailBoxPage} />);
    }

    const renderMail = ({ item }) => {
        if (!item.isFinish) {
            // 当前人物信息
            const figureInfo = figureList.find(f => f.id === item.figureId);
            if (figureInfo !== undefined) {
                return (
                    <View style={{ width: 80, marginLeft: 30 }}>
                        <TouchableOpacity onPress={() => { letter(item) }}>
                            <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 100, width: 80, borderRadius: 5 }} />
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
                <View style={{ paddingBottom: 8, paddingTop: 8, paddingLeft: 12, backgroundColor: '#e3d5c1', alignItems: 'flex-start', }}>
                    <Text style={{ fontSize: 24 }}>新信件</Text>
                    <Text style={{ fontSize: 18 }}>共有{mailHistoryData.filter(m => m.isFinish === false).length}位来访者</Text>
                </View>
                <View style={{ flex: 1, marginBottom: 30 }}>
                    <FlatList
                        data={mailHistoryData}
                        renderItem={renderMail}
                        keyExtractor={(item, index) => item + index}
                        ListFooterComponent={() => <View style={{ height: 18 }} />}
                        showsVerticalScrollIndicator={false}  // 隐藏滚动条
                        getItemLayout={(_data, index) => (
                            { length: 100, offset: 100 * index, index }
                        )}
                        numColumns={3}
                        columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            marginTop: 18,
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(MailBox)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
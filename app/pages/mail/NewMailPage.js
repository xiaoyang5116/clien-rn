import {
    View,
    Text,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect } from 'react'

import {
    action,
    connect,
    changeAvatar,
    ThemeContext
} from "../../constants";
import RootView from '../../components/RootView'
import Letter from './letter';

const NewMailPage = (props) => {
    const theme = React.useContext(ThemeContext);
    const windowWidth = Dimensions.get('window').width * 0.9;
    const marginLeft = (windowWidth - 80 * 3) / 4
    /**
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
        if (!item.isFinish) {
            // 当前人物信息
            const figureInfo = figureList.find(f => f.id === item.figureId);
            if (figureInfo !== undefined) {
                return (
                    <View style={{ width: 80, marginLeft: marginLeft, }}>
                        <TouchableOpacity onPress={() => { letter(item) }}>
                            <Image source={changeAvatar(figureInfo.avatar)} style={{ height: 100, width: 80, borderRadius: 5 }} />
                        </TouchableOpacity>
                    </View>
                )
            }
        }
    }

    return (
        <View style={{ flex: 1, }}>
            {/* head */}
            <View style={[theme.blockBgColor1, { paddingBottom: 8, paddingTop: 8, paddingLeft: 12, alignItems: 'flex-start' }]}>
                <Text style={[theme.titleColor1, theme.headerTitle1]}>新信件</Text>
                <Text style={[theme.titleColor2, theme.headerTitle2]}>共有{mailHistoryData.filter(m => m.isFinish === false).length}位来访者</Text>
            </View>
            <View style={{ flex: 1, marginBottom: 30, marginLeft: -12 }}>
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
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel, ...state.MailBoxModel }))(NewMailPage)
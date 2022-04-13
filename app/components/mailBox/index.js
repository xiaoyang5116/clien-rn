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


const data = [
    { id: "02", time: "2019-01-01", content: "这是一封测试邮件", isEmpty: false },
    { id: "04", time: "2019-01-01", content: "这是一封测试邮件", isEmpty: false },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
    { isEmpty: true },
]

const MailBox = (props) => {

    /**
     * currentStyles: 主题样式
     * onClose: 关闭弹窗
     * figureList: 人物列表
     */
    const { currentStyles, onClose, figureList } = props;

    useEffect(() => {
        if (figureList.length === 0) {
            props.dispatch(action('FigureModel/getFigureList')());
        }
    }, [])

    // 信件
    const letter = (id) => {
        console.log("id", id);
    }

    const renderMail = ({ item }) => {
        if (item.isEmpty) {
            return (
                <View style={{ width: 80, height: 100, marginLeft: 30, backgroundColor: 'green' }}></View>
            )
        } else {
            // 当前人物信息
            const figureInfo = figureList.find(f => f.id === item.id);
            if (figureInfo !== undefined) {
                return (
                    <View style={{ width: 80, marginLeft: 30 }}>
                        <TouchableOpacity onPress={() => { letter(item.id) }}>
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
                height: 500,
            }]}>
                {/* head */}
                <View style={{ paddingBottom: 8, paddingTop: 8, paddingLeft: 12, backgroundColor: '#e3d5c1', alignItems: 'flex-start', }}>
                    <Text style={{ fontSize: 24 }}>新信件</Text>
                    <Text style={{ fontSize: 18 }}>共有{data.filter(i => i.isEmpty === false).length}位来访者</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data}
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
            <View style={{ width: 360, marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <View></View>
                <TextButton style={{ width: 100 }} currentStyles={currentStyles} title={"返回"} onPress={onClose} />
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.FigureModel }))(MailBox)

const styles = StyleSheet.create({
    mailBox: {
        flex: 1,
        backgroundColor: "rgba(102, 102, 102, 0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
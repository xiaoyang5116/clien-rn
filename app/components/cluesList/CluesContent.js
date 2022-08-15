import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SectionList
} from 'react-native'
import React, { useState } from 'react'

import { ThemeContext } from '../../constants'

import { TextButton } from '../../constants/custom-ui';


const GroupHeader = (props) => {
    const { title } = props
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            marginTop: 24
        }}>
            <View style={{ height: 1, backgroundColor: "#ccc", flex: 1 }}></View>
            <Text style={{ fontSize: 16, color: "#000", paddingLeft: 8, paddingRight: 8 }}>{title}</Text>
            <View style={{ height: 1, backgroundColor: "#ccc", flex: 1 }}></View>
        </View>
    )
}

const CluesContent = (props) => {
    const theme = React.useContext(ThemeContext)

    const { cluesData, filterConditionData, checkedCluesId, setCheckedCluesId } = props

    // 首现循环每条线索,然后循环过滤条件,条件都满足就返回 true,最后根据状态分组并添加线索
    let DATA = [
        { status: 1, data: [] },
        { status: 2, data: [] },
        { status: 3, data: [] },
    ]
    for (let index = 0; index < cluesData.length; index++) {
        const cluesFilterCondition = cluesData[index].filterCondition;
        const isOk = filterConditionData.every((f) => {
            if (f.checkedOption === "全部") return true
            if (cluesFilterCondition[f.filterType] === f.checkedOption) return true
            else return false
        })
        if (isOk) {
            DATA.forEach(item => {
                if (item.status === cluesData[index].status) return item.data.push(cluesData[index])
            })
        }
    }


    const SelectItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View style={{ position: "absolute", top: -12, left: 8, backgroundColor: "#656565", zIndex: 1, paddingLeft: 4, paddingRight: 4 }}>
                    <Text style={[styles.title, { color: "#ffffff" }]}>{item.title}</Text>
                </View>

                <View style={styles.selectItem}>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
            </View>
        )
    }
    const UnselectedItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View style={{ position: "absolute", top: -12, left: 8, zIndex: 1, paddingLeft: 4, paddingRight: 4 }}>
                    <Text style={[styles.title, { color: item.status !== 1 ? "#7C7C7C" : "#000" }]}>{item.title}</Text>
                </View>

                <View style={styles.Unselected}>
                    <Text style={[styles.content, { color: item.status !== 1 ? "#7C7C7C" : "#000" }]}>{item.content}</Text>
                </View>
            </View >
        )
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { setCheckedCluesId(item.id) }}>
                {
                    (checkedCluesId === item.id) ? <SelectItem item={item} /> : <UnselectedItem item={item} />
                }
            </TouchableOpacity>
        )
    }

    const renderItemHeader = ({ section: { status, data } }) => {
        if (status === 1 && data.length > 0) return <View style={{ marginTop: 24 }} />
        if (status === 2 && data.length > 0) return <GroupHeader title={"已完成"} />
        if (status === 3 && data.length > 0) return <GroupHeader title={"已失效"} />
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item.status + index}
                renderItem={renderItem}
                renderSectionHeader={renderItemHeader}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default CluesContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 60,
        // backgroundColor: '#efefef'
    },
    item: {
        marginTop: 20,
        width: "100%",
        position: 'relative',
    },
    selectItem: {
        borderColor: "#656565",
        borderWidth: 1,
        padding: 11,
    },
    Unselected: {
        padding: 12,
    },
    title: {
        fontSize: 18,
    },
    content: {
        fontSize: 14,
    },
});
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SectionList
} from 'react-native'
import React, { useEffect, useState } from 'react'

import { ThemeContext } from '../../constants'

import { TextButton } from '../../constants/custom-ui';


const Separator = (props) => {
    const { title, style } = props
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: "center",
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            marginTop: 24,
            ...style
        }}>
            <View style={{ height: 1, backgroundColor: "#ccc", flex: 1 }}></View>
            <Text style={{ fontSize: 16, color: "#7C7C7C", paddingLeft: 8, paddingRight: 8 }}>{title}</Text>
            <View style={{ height: 1, backgroundColor: "#ccc", flex: 1 }}></View>
        </View>
    )
}

const UnusedCluesItem = (props) => {
    const { item, isChecked, setCheckedCluesId } = props
    return (
        <TouchableOpacity onPress={() => { setCheckedCluesId(item.id) }}>
            <View style={styles.itemContainer}>
                <View style={[styles.item_titleContainer, { backgroundColor: isChecked ? "#656565" : null }]}>
                    <Text style={[styles.title, { color: isChecked ? "#fff" : "#000" }]}>{item.title}</Text>
                </View>

                <View style={isChecked ? styles.selectItem : styles.Unselected}>
                    <Text style={[styles.content, { color: "#000" }]}>{item.content}</Text>
                </View>
            </View >
        </TouchableOpacity>
    )
}

const CompletedCluesItem = (props) => {
    const { item, isChecked, setCheckedCluesId } = props
    return (
        <TouchableOpacity onPress={() => { setCheckedCluesId(item.id) }}>
            <View style={styles.itemContainer}>
                <View style={[styles.item_titleContainer, { backgroundColor: isChecked ? "#656565" : null }]}>
                    <Text style={[styles.title, { color: isChecked ? "#fff" : "#7C7C7C" }]}>{item.title}</Text>
                    {isChecked ? null : <Text style={[styles.title, { color: "#00BD2D" }]}> (已完成)</Text>}
                </View>

                <View style={isChecked ? styles.selectItem : styles.Unselected}>
                    <Text style={[styles.content, { color: "#7C7C7C" }]}>{item.content}</Text>
                </View>
            </View >
        </TouchableOpacity>
    )
}

const InvalidCluesItem = (props) => {
    const { item, isChecked, setCheckedCluesId } = props
    return (
        <TouchableOpacity onPress={() => { setCheckedCluesId(item.id) }}>
            <View style={styles.itemContainer}>
                <View style={[styles.item_titleContainer, { backgroundColor: isChecked ? "#656565" : null }]}>
                    <Text style={[styles.title, { color: isChecked ? "#fff" : "#7C7C7C" }]}>{item.title}</Text>
                    {isChecked ? null : <Text style={[styles.title, { color: "#7C7C7C" }]}> (已失效)</Text>}
                </View>

                <View style={isChecked ? styles.selectItem : styles.Unselected}>
                    <Text style={[styles.content, { color: "#7C7C7C" }]}>{item.content}</Text>
                </View>
            </View >
        </TouchableOpacity>
    )
}


const CluesContent = (props) => {
    const theme = React.useContext(ThemeContext)

    const { cluesData, filterConditionData, checkedCluesId, setCheckedCluesId, isDisplayMore, setIsDisplayMore } = props

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

    const renderItem = ({ item }) => {
        const isChecked = (checkedCluesId === item.id)

        if (item.status === 1) return <UnusedCluesItem item={item} isChecked={isChecked} setCheckedCluesId={setCheckedCluesId} />
        if (item.status === 2 && isDisplayMore) return <CompletedCluesItem item={item} isChecked={isChecked} setCheckedCluesId={setCheckedCluesId} />
        if (item.status === 3 && isDisplayMore) return <InvalidCluesItem item={item} isChecked={isChecked} setCheckedCluesId={setCheckedCluesId} />
        return null
    }

    const renderItemHeader = ({ section: { status, data } }) => {
        if (status === 1 && data.length > 0) return <View style={{ marginTop: 24 }} />
        if (status === 2 && data.length > 0 && isDisplayMore) return <Separator title={"已完成"} />
        if (status === 3 && data.length > 0 && isDisplayMore) return <Separator title={"已失效"} />
    }

    const Footer = () => {
        if (isDisplayMore === false && (DATA[1].data.length > 0 || DATA[2].data.length > 0)) {
            return <Separator title={"上滑显示无效部分"} style={{ marginTop: 150 }} />
        }
        return null
    }

    const _onScrollEndDrag = (event) => {
        if (isDisplayMore === true || (DATA[1].data.length === 0 && DATA[2].data.length === 0)) return
        const offSetY = event.nativeEvent.contentOffset.y  // 滑动距离
        const contentSizeHeight = event.nativeEvent.contentSize.height  // 内容高度
        const SectionListHeight = event.nativeEvent.layoutMeasurement.height  // SectionList 的高度

        if (offSetY + SectionListHeight >= contentSizeHeight - 1) {
            setIsDisplayMore(true)
        }
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item.status + index}
                renderItem={renderItem}
                renderSectionHeader={renderItemHeader}
                ListFooterComponent={Footer}
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={_onScrollEndDrag}
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
        // marginBottom: 60,
        // backgroundColor:"red"
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

    // ----
    itemContainer: {
        marginTop: 20,
        width: "100%",
        position: 'relative',
    },
    item_titleContainer: {
        position: "absolute",
        top: -12,
        left: 8,
        zIndex: 1,
        paddingLeft: 4,
        paddingRight: 4,
        flexDirection: "row",
    },
});
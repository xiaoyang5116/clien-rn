import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import React, { useState } from 'react'

import { ThemeContext } from '../../constants'

import { TextButton } from '../../constants/custom-ui';


const CluesContent = (props) => {
    const theme = React.useContext(ThemeContext)

    const { cluesData, filterConditionData, checkedCluesId, setCheckedCluesId } = props

    // 首现循环每条线索,然后循环过滤条件,条件都满足就返回 true,最后添加线索
    let filteredCluesData = []
    for (let index = 0; index < cluesData.length; index++) {
        const cluesFilterCondition = cluesData[index].filterCondition;
        const isOk = filterConditionData.every((f) => {
            if (f.checkedOption === "全部") return true
            if (cluesFilterCondition[f.filterType] === f.checkedOption) {
                return true
            } else {
                return false
            }
        })
        if (isOk) filteredCluesData.push(cluesData[index])
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
                    <Text style={styles.title}>{item.title}</Text>
                </View>

                <View style={styles.Unselected}>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
            </View>
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

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredCluesData}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default CluesContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
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
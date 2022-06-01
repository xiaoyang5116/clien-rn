import { View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { ThemeContext } from '../../constants'
import { TextButton } from '../../constants/custom-ui';



const TabContent = (props) => {
    const theme = React.useContext(ThemeContext)
    const { clueData, checkedClue, setCheckedClue, filterArray } = props

    const filteredClueData = clueData.filter(c => {
        if (c.filter === undefined) return true
        return c.filter.every(f => {
            return filterArray.every(e => {
                if (f.filterType === e.filterType) {
                    if (e.filterTypeValue === "全部") { return true }
                    else { return f.filterTypeValue === e.filterTypeValue ? true : false }
                }
                return true
            })
        })
    })


    const SelecteItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <View style={{ position: "absolute", top: -12, left: 8, backgroundColor: "#656565", zIndex: 1, paddingLeft: 4, paddingRight: 4 }}>
                    <Text style={[styles.title, { color: "#ffffff" }]}>{item.title}</Text>
                </View>

                <View style={styles.selecteItem}>
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

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { setCheckedClue(index) }}>
                {
                    (checkedClue === index) ? <SelecteItem item={item} /> : <UnselectedItem item={item} />
                }
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredClueData}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default TabContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 60,
        backgroundColor: '#efefef'
    },
    item: {
        marginTop: 20,
        width: "100%",
        position: 'relative',
    },
    selecteItem: {
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
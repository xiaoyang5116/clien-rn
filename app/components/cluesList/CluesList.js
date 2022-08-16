import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'

import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    EventKeys,
    ThemeData
} from '../../constants'

import TabBarComponent from './TabBarComponent';
import CluesContent from './CluesContent';
import { TextButton } from '../../constants/custom-ui';


// 获取 标签数据 方法
function tabDataFun(cluesList) {
    let tabData = []
    for (let index = 0; index < cluesList.length; index++) {
        const item = cluesList[index];
        if (tabData.length === 0) {
            tabData.push({
                title: item.type,
                isDisplayMore: false
            })
        }
        else if (tabData.length > 0 && tabData.filter(i => i.title === item.type).length === 0) {
            tabData.push({
                title: item.type,
                isDisplayMore: false
            })
        }
    }
    return tabData
}

// 获取 筛选条件数组 方法
function allFilterDataFun(cluesList, cluesConfigData) {
    let allFilterData = []
    // 根据 配置的过滤数据循环
    for (let index = 0; index < cluesConfigData.filterData.length; index++) {
        // 某个类型的过滤配置
        const filterConfigItem = cluesConfigData.filterData[index];
        // 对应类型的线索数据
        const cluesData = cluesList.filter(i => i.type === filterConfigItem.type)
        // 如果没有对应线索 就跳过循环
        if (cluesData.length === 0) continue
        // 过滤条件
        const filterCondition = filterConfigItem.filterCondition.map(filterConfig => {
            const type = filterConfig.filterType
            // 添加过滤选项
            cluesData.map(clues => {
                const cluesFilterCondition = clues.filterCondition
                if (filterConfig.filterOption === undefined && cluesFilterCondition[type] !== undefined) {
                    filterConfig.filterOption = [cluesFilterCondition[type]]
                } else if (
                    Array.isArray(filterConfig.filterOption) &&
                    cluesFilterCondition[type] !== undefined &&
                    filterConfig.filterOption.filter(i => i === cluesFilterCondition[type]).length === 0
                ) {
                    filterConfig.filterOption.push(cluesFilterCondition[type])
                }
                if (Array.isArray(filterConfig.filterOption) &&
                    filterConfig.filterOption.length > 0 &&
                    filterConfig.filterOption.filter(i => i === "全部").length === 0
                ) {
                    filterConfig.filterOption.unshift("全部")
                }
            })
            if (filterConfig.filterOption !== undefined) {
                filterConfig.checkedOption = "全部"
                return filterConfig
            }
        })

        const currentFilterData = {
            type: filterConfigItem.type,
            filterCondition: filterCondition.filter(item => item !== undefined),
        }
        allFilterData.push(currentFilterData)
    }

    return allFilterData
}

// 筛选 选项
const FilterOption = (props) => {
    const { item, changeOptionHandler } = props
    const theme = ThemeData()
    // {"checkedOption": "全部", "filterOption": ["全部", "李家村"], "filterType": "location", "filterTypeName": "地址"}
    return (
        <View style={styles.filterOption_row}>
            <Text style={styles.filterOption_title}>{item.filterTypeName}: </Text>
            {
                item.filterOption.map((value, index) => {
                    return (
                        <TouchableOpacity
                            disabled={item.checkedOption === value ? true : false}
                            key={index}
                            onPress={() => { changeOptionHandler(item.filterType, value) }}
                        >
                            <View>
                                <Text style={[styles.filterOption_option, item.checkedOption === value ? theme.titleColor3 : { color: "#A4A4A4" }]}>
                                    {value}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const CluesList = (props) => {
    const theme = ThemeData()
    const { cluesList, cluesConfigData } = props

    // 线索为空就 返回 null
    if (!cluesList) return null

    // 标签数据
    const [tabData, setTabData] = useState(tabDataFun(cluesList))
    // 选中的标签
    const [selectedTab, setSelectedTab] = useState(tabData[0].title)

    // 选中标签 对应类型的 线索数据
    const cluesData = cluesList.filter(item => item.type === selectedTab)

    // 所有的 筛选数据
    const [allFilterData, setAllFilterData] = useState(allFilterDataFun(cluesList, cluesConfigData))
    // 当前的 筛选条件数据
    const filterConditionData = allFilterData.find(item => item.type === selectedTab).filterCondition
    // 修改 过滤选项 方法
    const changeOptionHandler = (type, value) => {
        const newFilterData = allFilterData.map(item => {
            if (item.type === selectedTab) {
                const filterCondition = item.filterCondition.map(f => f.filterType === type ? { ...f, checkedOption: value } : f)
                return { ...item, filterCondition }
            }
            return item
        })
        setAllFilterData(newFilterData)
    }

    // 选中的线索ID
    const [checkedCluesId, setCheckedCluesId] = useState(null)

    // 是否显示失效线索
    const isDisplayMore = tabData.find(item => item.title === selectedTab).isDisplayMore
    const setIsDisplayMore = () => {
        const newTabData = tabData.map(item => item.title === selectedTab ? { ...item, isDisplayMore: true } : item)
        setTabData(newTabData)
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#efefef' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <TabBarComponent
                    tabData={tabData}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    onClose={props.onClose}
                />
                <View style={styles.filterOption_container}>
                    {
                        filterConditionData.map((item, index) => {
                            return <FilterOption key={index} item={item} changeOptionHandler={changeOptionHandler} />
                        })
                    }
                </View>
                <CluesContent
                    cluesData={cluesData}
                    filterConditionData={filterConditionData}
                    checkedCluesId={checkedCluesId}
                    setCheckedCluesId={setCheckedCluesId}
                    isDisplayMore={isDisplayMore}
                    setIsDisplayMore={setIsDisplayMore}
                />
            </SafeAreaView>
        </View>
    )
}

export default connect(state => ({ ...state.CluesModel }))(CluesList)

const styles = StyleSheet.create({
    btnBox: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 60,
        justifyContent: "center",
        alignItems: 'center'
    },
    btn: {
        width: "30%",
    },
    filterOption_container: {
        paddingLeft: 12,
        paddingRight: 12,
    },
    filterOption_row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 12,
    },
    filterOption_title: {
        fontSize: 20,
    },
    filterOption_option: {
        marginLeft: 12,
        fontSize: 20,
    },
});

import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'

import RootView from '../RootView'
import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    EventKeys,
} from '../../constants'
import { HalfPanel } from '../panel'
import TabBarComponent from './TabBarComponent';
import TabContent from './TabContent';
import FilterClueGroup from './FilterClueGroup'
import { TextButton } from '../../constants/custom-ui';


const CluesList = (props) => {
    // 主题样式
    const theme = useContext(ThemeContext);
    // 线索集合
    const { cluesList, onClose } = props
    // tab index
    const [tabIndex, setTabIndex] = useState(0);
    // 选中的线索
    const [checkedClue, setCheckedClue] = useState(null);

    // 默认过滤条件数组
    const defaultFilterArray = cluesList[tabIndex].filter.map(m => ({
        filterType: m.filterType,
        filterTypeValue: "全部"
    }))
    const [filterArray, setFilterArray] = useState(defaultFilterArray)

    // 线索集合为空时 不显示
    if (cluesList.length === 0) {
        return null
    }

    // 更改过滤条件数组
    const updataFilterArray = ({ filterType, filterTypeValue }) => {
        setFilterArray(filterArray.map(f => f.filterType === filterType ? { ...f, filterTypeValue } : f))
    }

    return (
        <View style={[{ flex: 1, position: "relative" }]}>
            <TabBarComponent {...props}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                setCheckedClue={setCheckedClue}
            />
            {
                cluesList[tabIndex].filter.map((f, index) => {
                    return <FilterClueGroup key={index} filterType={f.filterType} filterOption={f.filterOption} updataFilterArray={updataFilterArray} />
                })
            }
            <TabContent
                clueData={cluesList[tabIndex].data}
                filterArray={filterArray}
                checkedClue={checkedClue}
                setCheckedClue={setCheckedClue}
            />
            {/* <View style={styles.btnBox}>
                <View style={styles.btn}>
                    <TextButton
                        title={"使用"}
                        onPress={() => { console.log("sss"); }}
                    />
                </View>
            </View> */}
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
});

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

const NewCluesList = (props) => {
    // 主题样式
    const theme = useContext(ThemeContext);

    // 线索列表: cluesList
    // 线索配置数据: cluesConfigData
    const { cluesList, cluesConfigData } = props

    const [tabIndex, setTabIndex] = useState(0)
    const [checkedClue, setCheckedClue] = useState(null)

    useEffect(() => {
        if (Object.keys(cluesConfigData).length === 0) {
            props.dispatch(action('CluesModel/getCluesConfigData')())
        }
    }, [])

    return (
        <View style={[{ flex: 1, position: "relative", backgroundColor: '#efefef' }]}>
            <TabBarComponent
                {...props}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                setCheckedClue={setCheckedClue}
            />
            {/* {
                cluesList[tabIndex].filter.map((f, index) => {
                    return <FilterClueGroup key={index} filterType={f.filterType} filterOption={f.filterOption} updataFilterArray={updataFilterArray} />
                })
            }*/}
            <TabContent
                {...props}
                tabIndex={tabIndex}
                // filterArray={filterArray}
                checkedClue={checkedClue}
                setCheckedClue={setCheckedClue}
            />
        </View>
    )
}

export default connect(state => ({ ...state.CluesModel }))(NewCluesList)
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext } from 'react'

import RootView from '../RootView'
import {
    AppDispath,
    ThemeContext,
    action,
    connect,
    EventKeys,
} from '../../constants'
import { HalfPanel } from '../panel'


const CluesList = (props) => {
    const theme = useContext(ThemeContext);
    // useEffect(() => {
    //     props.dispatch(action('CluesModel/addClue')({ cluesType: "SCENE", name: "xiansuo1" }))
    // }, [])
    console.log("cluesList", props.cluesList);
    const [selectedTab, setSelectTab] = React.useState(props.cluesList[0].cluesType);
    const [showData, setShowData] = React.useState(props.cluesList[0].data);
    return (
        <HalfPanel backgroundColor={'rgba(0,0,0, 0.7)'}>
            <View style={[theme.blockBgColor2, { flex: 1 }]}>

            </View>
        </HalfPanel>
    )
}

export default connect(state => ({ ...state.CluesModel }))(CluesList)
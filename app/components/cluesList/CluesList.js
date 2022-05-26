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
import { TextButton } from '../../constants/custom-ui';


const CluesList = (props) => {
    const theme = useContext(ThemeContext);
    const [index, setIndex] = React.useState(0);
    const { cluesList, onClose } = props
    const [selectedId, setSelectedId] = useState(null);

    if (cluesList.length === 0) {
        return null
    }

    return (
        <View style={[{ flex: 1, position: "relative" }]}>
            <TabBarComponent {...props}
                index={index}
                setIndex={setIndex}
                setSelectedId={setSelectedId}
            />
            <TabContent
                data={cluesList[index].data}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
            <View style={styles.btnBox}>
                <View style={styles.btn}>
                    <TextButton
                        title={"使用"}
                        onPress={()=>{console.log("sss");}}
                    />
                </View>
            </View>
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

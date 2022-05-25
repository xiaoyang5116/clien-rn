import { StyleSheet, Text, View, Dimensions } from 'react-native'
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
import TabBarComponent from './TabBarComponent';
import TabContent from './TabContent';
import { TextButton } from '../../constants/custom-ui';


const CluesList = (props) => {
    const theme = useContext(ThemeContext);
    const [index, setIndex] = React.useState(0);
    const { cluesList, onClose } = props

    if (cluesList.length === 0) {
        return null
    }

    return (
        <HalfPanel backgroundColor={'rgba(0,0,0, 0.7)'}>
            <View style={[theme.blockBgColor2, { flex: 1, position: "relative" }]}>
                <TabBarComponent {...props} index={index} setIndex={setIndex} />
                <TabContent data={cluesList[index].data} />
                <View style={styles.close}>
                    <TextButton
                        title={"关闭"}
                        onPress={onClose}
                    />
                </View>
            </View>
        </HalfPanel>
    )
}

export default connect(state => ({ ...state.CluesModel }))(CluesList)

const styles = StyleSheet.create({
    close: {
        position: "absolute",
        right: 12,
        bottom: 12,
        width: "30%",
    },
});

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native'
import React, { useRef, useContext } from 'react'
import { ThemeContext } from '../../constants'
import AntDesign from 'react-native-vector-icons/AntDesign';



const TabBarComponent = (props) => {
    const theme = useContext(ThemeContext)

    const { tabData, selectedTab, setSelectedTab } = props
    const scrollRef = useRef()

    const tabItems = tabData.map((item, i) => {
        return (
            <TouchableOpacity key={i} onPress={() => {
                setSelectedTab(item)
            }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Text style={[
                        styles.tabItem,
                        selectedTab === item ? { ...theme.titleColor3, ...styles.tabItem_select } : styles.tabItem_unselected
                    ]}>
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    })

    const CloseComponent = () => {
        return (
            <TouchableWithoutFeedback onPress={props.onClose}>
                <View style={styles.close}>
                    <AntDesign name='close' size={24} />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: "#656565" }]}>
            <ScrollView
                style={{ height: "100%", width: "100%" }}
                ref={scrollRef}
                horizontal
                directionalLockEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment={'center'}
            >
                {tabItems}
            </ScrollView>
            {
                props.onClose ? <CloseComponent /> : null
            }
        </View>
    )
}

export default TabBarComponent

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: 'center'
    },
    tabItem: {
        paddingLeft: 12,
        paddingRight: 12,
    },
    tabItem_select: {
        fontSize: 24
    },
    tabItem_unselected: {
        fontSize: 20,
        color: '#fff'
    },
    close: {
        marginRight: 12
    }
});
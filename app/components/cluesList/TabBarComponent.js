import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useRef, useContext } from 'react'
import { ThemeContext } from '../../constants'



const TabBarComponent = (props) => {
    const theme = useContext(ThemeContext)
    const { cluesList, index, setIndex, setSelectedId } = props
    const scrollRef = useRef()

    return (
        <View style={[styles.container, { backgroundColor: "#656565" }]}>
            <ScrollView
                style={{ flex: 1 }}
                ref={scrollRef}
                horizontal
                directionalLockEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment={'center'}
            >
                {
                    cluesList.map((item, i) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => {
                                setIndex(i)
                                setSelectedId(null)
                            }}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                                    <Text style={[styles.tabItem, index === i ? theme.titleColor3 : { color: "#ffffff" }]} >
                                        {item.cluesTypeName}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

export default TabBarComponent

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 60,
    },
    tabItem: {
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 20,
    },
});
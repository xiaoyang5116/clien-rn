import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Tab, TabView } from '@rneui/themed'

import RootView from '../RootView'

import Farm from './Farm'



const Plant = () => {
    const [tabIndex, setTabIndex] = useState(0)
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }} >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Tab
                        value={tabIndex}
                        onChange={(index) => setTabIndex(index)}
                        disableIndicator={true}
                    >
                        <Tab.Item title={"春"} />
                        <Tab.Item title={"夏"} />
                        <Tab.Item title={"秋"} />
                        <Tab.Item title={"东"} />
                    </Tab>
                    <TabView
                        value={tabIndex}
                        onChange={(index) => {
                            if (index < 0) return setTabIndex(3)
                            if (index > 3) return setTabIndex(0)
                            return setTabIndex(index)
                        }}
                        animationType="timing"
                        animationConfig={{ duration: 200 }}
                    >
                        <TabView.Item style={styles.TabView_item_container}>
                            <Farm />
                        </TabView.Item>
                        <TabView.Item style={styles.TabView_item_container}>
                            <View style={{ flex: 1, backgroundColor: "red" }}></View>

                        </TabView.Item>
                        <TabView.Item style={styles.TabView_item_container} >
                            <View style={{ flex: 1, backgroundColor: "pink" }}></View>

                        </TabView.Item>
                        <TabView.Item style={styles.TabView_item_container}>
                            <View style={{ flex: 1, backgroundColor: "pink" }}></View>

                        </TabView.Item>
                    </TabView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Plant

export class PlantPage {
    static show() {
        const key = RootView.add(
            <Plant onClose={() => { RootView.remove(key) }} />
        )
    }
}

const styles = StyleSheet.create({
    TabContainerStyle: {
        width: "100%",
        height: 50,
        paddingLeft: 12,
        paddingRight: 12,
    },
    TabItem: {
        fontSize: 16,
        color: "#858585",
        backgroundColor: "#f2f2f2",
        width: 100,
        height: 50,
        lineHeight: 45
    },
    TabItem_active: {
        fontSize: 20,
        color: "#000",
        backgroundColor: "#f2f2f2",
        width: 100,
        height: 50,
        lineHeight: 45
    },
    TabView_item_container: {
        flex: 1,
        marginTop: 12,
        paddingLeft: 12,
        paddingRight: 12,
    }
})



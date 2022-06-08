import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'

import { Tab, TabView } from "@rneui/themed";

const Classification = (props) => {
    const [tabIndex, setTabIndex] = useState(0)

    return (
        <View style={{ width: "100%", height: 300, marginTop: 12, }}>
            <Tab
                value={tabIndex}
                onChange={(index) => setTabIndex(index)}
                containerStyle={styles.TabContainerStyle}
                disableIndicator={true}
                scrollable={true}
            >
                <Tab.Item
                    title={"精选"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 50 }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"动态"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 50 }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"文字开黑"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 80 }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"看比赛"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 70 }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"云顶上分"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 80 }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"看电影"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 70 }}
                    buttonStyle={{ padding: 0 }}
                />
            </Tab>
            <TabView
                value={tabIndex}
                onChange={(index) => {
                    if (index < 0) return setTabIndex(5)
                    if (index > 5) return setTabIndex(0)
                    return setTabIndex(index)
                }}
                animationType="timing"
                // disableSwipe={true}
                animationConfig={{ duration: 200 }}
                tabItemContainerStyle={{
                    marginTop: 12,
                }}
            >
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingLeft: 4, paddingRight: 4 }}>
                        <View style={{ width: "48%", height: "100%", borderRadius: 6, backgroundColor: 'pink', }}></View>
                        <View style={{ width: "48%", height: "100%", borderRadius: 6, backgroundColor: 'pink', }}></View>
                    </View>
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: 'pink', marginRight: 12 }}></View>
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: 'pink', marginRight: 12 }}></View>
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: 'pink', marginRight: 12 }}></View>
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: 'pink', marginRight: 12 }}></View>
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <View style={{ width: 200, height: 100, borderRadius: 6, backgroundColor: 'pink', marginRight: 12 }}></View>
                </TabView.Item>
            </TabView>
        </View>
    )
}

export default Classification

const styles = StyleSheet.create({
    TabContainerStyle: {
        width: "100%",
        height: 50,
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
        fontSize: 18,
        color: "#000",
        backgroundColor: "#f2f2f2",
        width: 120,
        height: 50,
        lineHeight: 45
    },
    TabView_item_container: {
        flex: 1,
    }
})
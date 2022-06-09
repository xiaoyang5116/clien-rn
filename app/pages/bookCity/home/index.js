import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'

import { Tab, TabView } from "@rneui/themed";

import {
    connect,
    Component,
    ThemeContext,
} from "../constants";
import FeaturedPage from './featured'


const BookCityHome = (props) => {
    const [tabIndex, setTabIndex] = useState(0)

    return (
        <View style={{ flex: 1, marginTop: 40 }}>
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
                    containerStyle={{ width: 70, backgroundColor: '#f2f2f2' }}
                    buttonStyle={{ padding: 0 }}
                />
                <Tab.Item
                    title={"动态"}
                    titleStyle={(active) => active ? styles.TabItem_active : styles.TabItem}
                    containerStyle={{ width: 70, backgroundColor: '#f2f2f2' }}
                    buttonStyle={{ padding: 0 }}
                />
            </Tab>
            <TabView
                value={tabIndex}
                onChange={setTabIndex}
                animationType="timing"
                disableSwipe={true}
                animationConfig={{ duration: 200 }}
            >
                <TabView.Item style={styles.TabView_item_container}>
                    <FeaturedPage />
                </TabView.Item>
                <TabView.Item style={styles.TabView_item_container}>
                    <FeaturedPage />
                </TabView.Item>
            </TabView>
        </View>
    )
}

export default BookCityHome

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
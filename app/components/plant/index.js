import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Tab, TabView } from '@rneui/themed'

import RootView from '../RootView'

import Farm from './Farm'
import { TextButton } from '../../constants/custom-ui'


// Carousel 无线滑动组件
const Plant = (props) => {
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
                        <Tab.Item title={"冬"} />
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
                    <View style={{ position: "absolute", bottom: 0, left: 40, height: 40 }}>
                        <TextButton title={"退出"} onPress={props.onClose} />
                    </View>
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
    TabView_item_container: {
        flex: 1,
        marginTop: 12,
        paddingLeft: 12,
        paddingRight: 12,
    }
})



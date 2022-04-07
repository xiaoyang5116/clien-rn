import { Text, View, StyleSheet } from 'react-native'
import React, { PureComponent } from 'react'

export default class MultiplayerDialog extends PureComponent {
    render() {
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <View style={styles.fullContainer}>
                    {/* 显示区域 */}
                    <View>
                        <Text>MultiplayerDialog</Text>
                    </View>
                    {/* 按钮区域 */}
                    <View>
                        <Text>MultiplayerDialog</Text>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        opacity: 1,
    },
    halfContainer: {
        width: 360,
        height: 600,
    },
});
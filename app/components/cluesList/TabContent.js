import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { ThemeContext } from '../../constants'
import { TextButton } from '../../constants/custom-ui';



const TabContent = (props) => {
    const { data } = props
    const theme = React.useContext(ThemeContext)

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.item, theme.blockBgColor1]}>
                <View style={styles.header}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.btn}>
                        <TextButton
                            title={"使用"}
                            onPress={() => {
                                console.log(item.condition);
                            }}
                        />
                    </View>
                </View>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default TabContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 60,
    },
    item: {
        marginTop: 12,
        width: "100%",
        padding: 16,
    },
    header: {
        position: "relative",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
    },
    content: {
        marginTop: 8,
        fontSize: 14,
    },
    btn: {
        // position: 'absolute',
        // right: 0,
        width: "30%",
    },
});
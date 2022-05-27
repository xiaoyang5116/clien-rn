import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { TextButton } from '../../constants/custom-ui';

const FilterClues = (props) => {

    const Btn = (props) => {
        return (
            <TouchableWithoutFeedback>
                <TextButton title={props.title} />
            </TouchableWithoutFeedback>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Btn title={"全部"} />
                <Btn title={"李家村"} />
                <Btn title={"王家村"} />
            </View>
        </View>
    )
}

export default FilterClues

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    row: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
        alignItems: "center",
    },
})
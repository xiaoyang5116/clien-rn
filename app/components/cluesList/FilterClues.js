import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { TextButton } from '../../constants/custom-ui';
import { ButtonGroup } from "@rneui/themed";

const FilterClues = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const Btn = (props) => {
        return (
            <TouchableWithoutFeedback>
                <View>
                    <TextButton title={props.title} />
                </View>
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
            <ButtonGroup
                buttons={['SIMPLE', 'BUTTON', 'GROUP']}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                containerStyle={{ marginBottom: 20 }}
            />
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
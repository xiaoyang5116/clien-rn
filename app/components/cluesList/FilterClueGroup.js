import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { PureComponent, useState } from 'react'
import { TextButton } from '../../constants/custom-ui';
import { ButtonGroup } from "@rneui/themed";


class FilterClueGroup extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
        }
    }
    render() {
        const { filterType, filterOption, updataFilterArray } = this.props
        return (
            <View style={styles.container}>
                <ButtonGroup
                    buttons={filterOption}
                    selectedIndex={this.state.selectedIndex}
                    onPress={(value) => {
                        this.setState({ selectedIndex: value });
                        updataFilterArray({
                            filterType,
                            filterTypeValue: filterOption[value],
                        })
                    }}
                />
            </View>
        )
    }
}

export default FilterClueGroup

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
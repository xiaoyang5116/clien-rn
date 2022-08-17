import React from 'react';

import {
    connect,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
} from '../../constants/native-ui';

import { 
    FlatList, TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import CollectionItem from './collection/CollectionItem';

const DATA = [
    [{ id: 0, title: 'A' }, { id: 1, title: 'B' }, { id: 2, title: 'C' }, { id: 3, title: 'D' }],
    [{ id: 4, title: 'E' }, { id: 5, title: 'F' }, { id: 6, title: 'G' }, { id: 7, title: 'H' }],
    [{ id: 8, title: 'I' }, { id: 9, title: 'J' }, { id: 10, title: 'K' }, ],
]

const CollectionTabPage = (props) => {

    const renderItem = (data) => {
        const items = [];
        if (lo.isArray(data.item)) {
            lo.forEach(data.item, (v, k) => {
                items.push(
                    <View key={k} style={{ marginLeft: 8, marginRight: 8 }}>
                        <CollectionItem />
                    </View>
                );
            });
        }
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8, marginBottom: 8 }}>
                {items}
            </View>
        );
    }

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text>金: 1000</Text>
                <Text>银: 2000</Text>
                <Text>铜: 3000</Text>
            </View>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TextButton title={'金'} />
                <TextButton title={'木'} />
                <TextButton title={'水'} />
                <TextButton title={'火'} />
                <TextButton title={'土'} />
                <TextButton title={'特殊'} />
            </View>
            <View>
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    viewContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

});

export default connect((state) => ({ ...state.AppModel }))(CollectionTabPage);
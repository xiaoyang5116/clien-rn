import React from 'react';

import {
    AppDispath,
    connect,
    StyleSheet,
} from "../../constants";

import {
    View,
    Text,
} from '../../constants/native-ui';

import { 
    DeviceEventEmitter,
    FlatList,
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import CollectionItem from './collection/CollectionItem';

const CollectionTabPage = (props) => {

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const eventKey = '__@CollectionTabPage.refresh';
        const listener = DeviceEventEmitter.addListener(eventKey, (data) => {
            const copy = lo.cloneDeep(data);
            const result = [];

            while (copy.length > 0) {
                const list = [];
                for (let i = 0; i < 4; i++) {
                    const item = copy.shift();
                    if (item != undefined) {
                        list.push(item);
                    } else {
                        break
                    }
                }
                result.push(list);
            }
            setData(result);
        });

        AppDispath({ type: 'CollectionModel/getCollectionList', payload: {}, retmsg: eventKey});
        return () => {
            listener.remove();
        }
    }, []);

    const renderItem = (data) => {
        const items = [];
        if (lo.isArray(data.item)) {
            lo.forEach(data.item, (v, k) => {
                items.push(
                    <View key={k} style={{ marginLeft: 8, marginRight: 8 }}>
                        <CollectionItem data={v} />
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

    console.debug('render');

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text>金: 0</Text>
                <Text>银: 0</Text>
                <Text>铜: 0</Text>
            </View>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TextButton title={'金'} />
                <TextButton title={'木'} />
                <TextButton title={'水'} />
                <TextButton title={'火'} />
                <TextButton title={'土'} />
                <TextButton title={'特殊'} />
            </View>
            <View style={{ width: '96%', height: '100%' }}>
                <FlatList
                    data={data}
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
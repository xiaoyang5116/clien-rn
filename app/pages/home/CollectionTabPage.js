import React from 'react';

import {
    AppDispath,
    connect,
    EventKeys,
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
import AntDesign from 'react-native-vector-icons/AntDesign';

const PropYaoShui = (props) => {
    const CALLBACK_EVENT_KEY = `__@PropYaoShui_${props.propId}`;
    
    const [num, setNum] = React.useState('');

    const updateHandler = () => {
        AppDispath({ type: 'PropsModel/getPropNum', payload: { propId: props.propId }, retmsg: CALLBACK_EVENT_KEY });
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(CALLBACK_EVENT_KEY, (v) => {
            setNum(v);
        });
        return () => {
            listener.remove();
        }
    }, []);
    
    React.useEffect(() => {
        updateHandler();
        const listener = DeviceEventEmitter.addListener(EventKeys.PROPS_NUM_CHANGED, () => {
            updateHandler();
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name='appstore1' color={props.color} size={20} />
        <Text style={{color:'#111'}}>: {num}</Text>
    </View>
    );
}
 
const CollectionTabPage = (props) => {

    const GET_LIST_EVENT_KEY = '__@CollectionTabPage.getList';
    
    const [data, setData] = React.useState([]);

    const selectCategory = (category) => {
        AppDispath({ type: 'CollectionModel/getCollectionList', payload: { category }, retmsg: GET_LIST_EVENT_KEY});
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(GET_LIST_EVENT_KEY, (data) => {
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

        selectCategory('金')

        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@CollectionTabPage.refresh', () => {
            selectCategory('金');
        });
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

    // 改良所需道具
    const improvementProps = props.__data.config.improvementProps;

    return (
        <View style={styles.viewContainer}>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <PropYaoShui color={'green'} propId={improvementProps[0]} />
                <PropYaoShui color={'blue'} propId={improvementProps[1]} />
                <PropYaoShui color={'purple'} propId={improvementProps[2]} />
                <PropYaoShui color={'orange'} propId={improvementProps[3]} />
            </View>
            <View style={{ width: '96%', marginTop: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: 'rgba(238,212,183,0.5)', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TextButton title={'金'} onPress={() => selectCategory('金')} />
                <TextButton title={'木'} onPress={() => selectCategory('木')} />
                <TextButton title={'水'} onPress={() => selectCategory('水')} />
                <TextButton title={'火'} onPress={() => selectCategory('火')} />
                <TextButton title={'土'} onPress={() => selectCategory('土')} />
                <TextButton title={'特殊'} onPress={() => selectCategory('特殊')} />
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

export default connect((state) => ({ ...state.AppModel, ...state.CollectionModel, user: { ...state.UserModel } }))(CollectionTabPage);

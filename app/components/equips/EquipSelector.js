import React from 'react';

import {
    AppDispath,
    ThemeContext,
} from "../../constants";

import {
    View,
    Text,
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { 
    DeviceEventEmitter,
    FlatList, 
    StyleSheet, 
    TouchableOpacity
} from 'react-native';

import { TextButton } from '../../constants/custom-ui';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const EquipSelector = (props) => {

    const [data, setData] = React.useState([]);
    const [select, setSelect] = React.useState(0);
    const context = React.useContext(ThemeContext);

    React.useEffect(() => {
        AppDispath({ type: 'PropsModel/getPropsFromAttr', payload: { attr: '装备' }, cb: (data) => {
            if (data.length > 0) {
                const filter = data.filter(e => e.tags.indexOf(props.tag) != -1);
                setData(filter);
            }
        }});
    }, []);

    const renderItem = (data) => {
        let color = {};
        if (data.item.quality != undefined) {
            if (data.item.quality == '1') {
                color = selectorStyles.quality1;
            } else if (data.item.quality == '2') {
                color = selectorStyles.quality2;
            } else if (data.item.quality == '3') {
                color = selectorStyles.quality3;
            }
        }
        return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            setSelect(data.item.id);
            setTimeout(() => {
                DeviceEventEmitter.emit('__@EquipSelector.select', { tag: props.tag, e: data.item });
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }, 200);
        }}>
            <View style={[selectorStyles.propsItem, (data.index == 0) ? selectorStyles.propsTopBorder : {}]}>
                {(select == data.item.id) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={context.propSelectedImage} /> : <></>}
                <View style={selectorStyles.propsBorder}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <Text style={[{ marginLeft: 20, fontSize: 22 }, color]}>{data.item.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginRight: 20, fontSize: 22, color: '#424242', textAlign: 'right' }}>x{data.item.num}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    return (
        <View style={selectorStyles.selectorContainer}>
            <View style={selectorStyles.selectorView}>
                <TouchableWithoutFeedback onPress={() => {
                    if (props.onClose != undefined) {
                        props.onClose();
                    }
                }}>
                    <View style={{ position: 'absolute', width: '100%', marginTop: 3, paddingRight: 5, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <AntDesign name='close' size={28} color={'#000'} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={selectorStyles.headerView}>
                    <Text style={{ fontSize: 22, color: '#000' }}>选择装备</Text>
                </View>
                {
                (props.currentEquipId > 0)
                ? (
                <View style={selectorStyles.rmView}>
                    <View style={{ width: 60, marginLeft: 12 }}>
                        <TextButton title={'卸下'} onPress={() => {
                            DeviceEventEmitter.emit('__@EquipSelector.select', { tag: props.tag, e: null });
                            if (props.onClose != undefined) {
                                props.onClose();
                            }
                        }} />
                    </View>
                </View>
                )
                : <></>
                }
                <View style={selectorStyles.listView}>
                    <FlatList
                        style={{ paddingTop: 2, height: '100%' }}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </View>
    );
}

const selectorStyles = StyleSheet.create({
    selectorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    selectorView: {
        width: '94%',
        height: 500,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    headerView: {
        width: '50%',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listView: {
        width: '94%',
        height: 450,
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rmView: {
        width: '94%',
        height: 40,
        justifyContent: 'center',
        // backgroundColor: '#669900',
    },
    quality1: {
        color: '#929292'
    },
    quality2: {
        color: '#0433ff'
    },
    quality3: {
        color: '#00f900'
    },
    propsTopBorder: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    propsItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: px2pd(108),
    },
    propsBorder: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginLeft: 1,
        marginRight: 1,
    },
    propsTopBorder: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    propsBorder: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginLeft: 1,
        marginRight: 1,
    },
});

export default EquipSelector;
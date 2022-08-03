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
    FlatList, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import { TextButton } from '../../constants/custom-ui';
import * as DateTime from '../../utils/DateTimeUtils';
import RootView from '../../components/RootView';
import PropTips from '../../components/tips/PropTips';

const ShopPage = (props) => {

    const [data, setData] = React.useState([]);
    const [select, setSelect] = React.useState(0);
    const context = React.useContext(ThemeContext);
    const refreshTime = React.useRef(0);

    const refresh = () => {
        AppDispath({ type: 'ShopModel/getList', payload: { }, cb: (data) => {
            if (data == null)
                return
            //
            refreshTime.current = data.timeout;
            setData(data.data);
        }});
    }

    const buy = (propId) => {
        AppDispath({ type: 'ShopModel/buy', payload: { propId: propId }, cb: (v) => {
            if (v) {
                refresh();
            }
        } });
    }

    React.useEffect(() => {
        refresh();
    }, []);

    const renderItem = (data) => {
        let color = {};
        if (data.item.propConfig.quality != undefined) {
            if (data.item.propConfig.quality == '1') {
                color = styles.quality1;
            } else if (data.item.propConfig.quality == '2') {
                color = styles.quality2;
            } else if (data.item.propConfig.quality == '3') {
                color = styles.quality3;
            }
        }
        return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            setSelect(data.item.propId);
            setTimeout(() => {
                const key = RootView.add(<PropTips propId={data.item.propId} viewOnly={true} onClose={() => {
                    RootView.remove(key);
                }} />);
            }, 0);
        }}>
            <View style={[styles.propsItem, (data.index == 0) ? styles.propsTopBorder : {}]}>
                {(select == data.item.propId) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={context.propSelectedImage} /> : <></>}
                <View style={styles.propsBorder}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={[{ marginLeft: 20, fontSize: 22 }, color]}>{data.item.propConfig.name}</Text>
                        <Text style={[{ marginLeft: 5, fontSize: 14 }, color]}>(库存: {data.item.num})</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginRight: 20, fontSize: 16, color: '#424242', textAlign: 'right' }}>消耗: 灵石x{data.item.num}</Text>
                    </View>
                    <View style={{ width: 60, height: 32 }}>
                        {
                        (data.item.num > 0)
                        ? <TextButton title='购买' fontSize={16} onPress={() => buy(data.item.propId)} />
                        : <TextButton title='购买' fontSize={16} disabled={true} />
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    let nextRefreshTimeStr = '';
    if (refreshTime.current > 0) {
        nextRefreshTimeStr = DateTime.format(refreshTime.current, 'hh:mm:ss');
    }

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.viewContainer}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <View style={{ position: 'absolute', width: '100%', marginTop: 3, paddingRight: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <AntDesign name='left' style={{ marginLeft: 5 }} size={28} color={'#000'} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.headerView}>
                        <Text style={{ fontSize: 22, color: '#000' }}>市场</Text>
                    </View>
                    <View style={styles.listView}>
                        <FlatList
                            style={{ paddingTop: 2, height: '100%' }}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.propId}
                        />
                    </View>
                    <View style={styles.refreshBanner}>
                        <Text>下次刷新：{nextRefreshTimeStr}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
    },
    viewContainer: {
        width: '100%',
        height: '100%',
        // borderWidth: 1,
        // borderColor: '#333',
        alignItems: 'center',
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
    refreshBanner: {
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        height: 50, 
        // backgroundColor: '#669900', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
});

export default ShopPage;
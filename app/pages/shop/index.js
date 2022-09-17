import React from 'react';

import {
    AppDispath,
    connect,
    errorMessage,
    getWindowSize,
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
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity
} from 'react-native';

import lo from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import { TextButton } from '../../constants/custom-ui';
import * as DateTime from '../../utils/DateTimeUtils';
import RootView from '../../components/RootView';
import PropTips from '../../components/tips/PropTips';
import PropGrid from '../../components/prop/PropGrid';
import Slider from '@react-native-community/slider';

const WIN_SIZE = getWindowSize();

const ItemsBar = (props) => {

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        AppDispath({ type: 'PropsModel/getBagProps', payload: { propsId: props.itemsId, always: true }, cb: (result) => {
            if (lo.isArray(result) && result.length > 0) {
                setData(result);
            }
        }});
    }, []);

    const subViews = [];
    if (data.length > 0) {
        lo.forEach(data, (v, k) => {
            subViews.push(
                <View key={k} style={{ marginRight: 10 }}>
                    <Text>{v.name}: {v.num}</Text>
                </View>
            );
        });
    }

    return (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            {subViews}
        </View>
    );
}

const SellConfirm = (props) => {

    const maxValue = React.useRef(props.maxNum);
    const sliderValue = React.useRef((props.maxNum > 1 ? Math.floor(props.maxNum / 2) : props.maxNum));
    const [selectNum, setSelectNum] = React.useState((props.maxNum > 1 ? Math.floor(props.maxNum / 2) : props.maxNum));

    const onValueChanged = (value) => {
        setSelectNum(value);
    }

    const onSell = () => {
        AppDispath({ type: 'ShopsModel/sell', payload: { shopId: props.shopId, propId: props.propId, num: selectNum }, cb: (v) => {
            if (v) {
                DeviceEventEmitter.emit('__@ShopPage.refresh');
            }
            if (props.onClose != undefined) {
                props.onClose();
            }
        } });
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 100 }} onTouchStart={() => {
                if (props.onClose != undefined) {
                    props.onClose();
                }
            }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: px2pd(900), height: px2pd(900), backgroundColor: '#eee', alignItems: 'center' }} onTouchStart={(e) => {
                        e.stopPropagation();
                    }}>
                    <View style={{ width: '96%', height: px2pd(120), marginTop: 5, backgroundColor: '#aaa', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontSize: 26, fontWeight: 'bold' }}>选择出售数量</Text>
                    </View>
                    <View style={{ width: '90%', marginTop: px2pd(160), marginBottom: px2pd(160) }}>
                        <Slider
                            value={sliderValue.current}
                            step={1}
                            maximumValue={maxValue.current}
                            minimumValue={1}
                            minimumTrackTintColor="#333"
                            maximumTrackTintColor={"#ccc"}
                            onValueChange={onValueChanged}
                        />
                    </View>
                    <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#333', fontWeight: 'bold' }}>选择数量: {selectNum}</Text>
                    </View>
                    <View style={{ width: '90%', marginTop: px2pd(80), justifyContent: 'center', alignItems: 'center' }}>
                        <TextButton style={{ width: 100 }} title={'出售'} onPress={onSell} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const ShopPage = (props) => {

    const [data, setData] = React.useState([]);
    const [select, setSelect] = React.useState(0);
    const context = React.useContext(ThemeContext);
    const refreshTime = React.useRef(0);
    const shopConfig = React.useRef(null);
    const forceUIRefreshKey = React.useRef(0);

    const refresh = () => {
        AppDispath({ type: 'ShopsModel/getList', payload: { shopId: props.shopId }, cb: (result) => {
            if (result == null)
                return
            //
            refreshTime.current = result.timeout;
            shopConfig.current = result.config;
            setData(result.data);
        }});
    }

    const buy = (propId) => {
        AppDispath({ type: 'ShopsModel/buy', payload: { shopId: props.shopId, propId: propId }, cb: (v) => {
            if (v) {
                refresh();
            }
        } });
    }

    const sell = (propId, maxNum) => {
        const key = RootView.add(<SellConfirm shopId={props.shopId} propId={propId} maxNum={maxNum} onClose={() => {
            RootView.remove(key);
        }} />);
    }

    React.useEffect(() => {
        refresh();
        const listener = DeviceEventEmitter.addListener('__@ShopPage.refresh', () => {
            refresh();
        });
        return () => {
            listener.remove();
        }
    }, []);

    const renderItem = ({ item, index }) => {
        let color = {};
        if (item.propConfig.quality != undefined) {
            if (item.propConfig.quality == '1') {
                color = styles.quality1;
            } else if (item.propConfig.quality == '2') {
                color = styles.quality2;
            } else if (item.propConfig.quality == '3') {
                color = styles.quality3;
            }
        }

        let labelItems = '';
        let labelNum = '';
        const itemList = [];
        let btnView = null;

        if (lo.isArray(item.config.consume)) {
            labelItems = '消耗:';
            labelNum = '库存';
            item.config.consume.forEach(e => {
                if (e.propConfig != undefined) {
                    itemList.push(`${e.propConfig.name}x${e.num}`);
                }
            });
            btnView = ((item.num > 0)
                ? <TextButton title='购买' fontSize={16} onPress={() => buy(item.propId)} />
                : <TextButton title='购买' fontSize={16} disabled={true} />
            );
        } else if (lo.isArray(item.propConfig.sell)) {
            labelItems = '获得:';
            labelNum = '拥有';
            item.propConfig.sell.forEach(e => {
                itemList.push(`${e.propConfig.name}x${e.num}`);
            });
            btnView = ((item.num > 0)
                ? <TextButton title='出售' fontSize={16} onPress={() => sell(item.propId, item.num)} />
                : <TextButton title='出售' fontSize={16} disabled={true} />
            );
        } else {
            errorMessage("商城道具错误，请检查商城道具是否已指定消耗或卖出配置");
        }

        return (
        <TouchableOpacity activeOpacity={1} onPress={() => {
            setSelect(item.propId);
            setTimeout(() => {
                const key = RootView.add(<PropTips zIndex={99} propId={item.propId} viewOnly={true} onClose={() => {
                    RootView.remove(key);
                }} />);
            }, 0);
        }}>
            <View style={[styles.propsItem, (index == 0) ? styles.propsTopBorder : {}]}>
                {(select == item.propId) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={context.propSelectedImage} /> : <></>}
                <View style={styles.propsBorder}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <PropGrid prop={item.propConfig} showNum={false} showLabel={false} imageStyle={{ width: px2pd(100), height: px2pd(100) }} />
                        <Text numberOfLines={1} style={[{ marginLeft: 5, fontSize: 22 }, color]}>{item.propConfig.name}</Text>
                        <Text style={[{ marginLeft: 5, fontSize: 13 }, color]}>({labelNum}: {item.num})</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginRight: 20, fontSize: 13, color: '#424242', textAlign: 'right' }}>{labelItems} {lo.join(itemList, ',')}</Text>
                    </View>
                    <View style={{ height: 32, flexDirection: 'row', alignItems: 'center' }}>
                        {btnView}
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

    if (data != null) {
        forceUIRefreshKey.current += 1;
    }

    const itemsId = [];
    if (shopConfig.current != null) {
        if (shopConfig.current.buy_list != undefined) {
            lo.forEach(shopConfig.current.buy_list, (v, k) => {
                if (v.consume != undefined && lo.isArray(v.consume)) {
                    lo.forEach(v.consume, (v2, k2) => {
                        if (lo.indexOf(itemsId, v2.propId) == -1) {
                            itemsId.push(v2.propId);
                        }
                    });
                }
            })
        } else if (shopConfig.current.sell_list != undefined) {
            itemsId.push(887); // 默认铜币道具
        }
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
                        <Text style={{ fontSize: 22, color: '#000' }}>{(shopConfig.current != null) ? shopConfig.current.name : ''}</Text>
                    </View>
                    <View style={styles.attrsView}>
                        <ItemsBar key={forceUIRefreshKey.current} itemsId={itemsId} />
                    </View>
                    <View style={styles.listView}>
                        <FlatList
                            style={{ paddingTop: 2, height: '100%' }}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.propId}
                        />
                    </View>
                    {
                    (shopConfig.current != null && shopConfig.current.cdValue > 0)
                    ?
                    (
                    <View style={styles.refreshBanner}>
                        <Text>下次刷新：{nextRefreshTimeStr}</Text>
                    </View>
                    )
                    : <></>
                    }
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
        zIndex: 99,
    },
    viewContainer: {
        width: WIN_SIZE.width,
        height: '100%',
        alignItems: 'center',
    },
    headerView: {
        width: '50%',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attrsView: {
        width: '94%',
        height: 24,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: '#669900',
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
        height: px2pd(120),
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

export default connect((state) => ({ user: { ...state.UserModel } }))(ShopPage);
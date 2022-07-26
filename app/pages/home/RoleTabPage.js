import React from 'react';

import {
    AppDispath,
    connect,
    getWindowSize,
    StyleSheet,
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
    ScrollView, 
    TouchableOpacity
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCapInset from 'react-native-image-capinsets-next';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const WIN_SIZE = getWindowSize();

const RoleAttrsDetailPage = (props) => {
    return (
        <View style={detailStyles.viewContainer}>
            <View style={detailStyles.bodyContainer}>
                <View style={detailStyles.closeButtonView}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }}>
                        <AntDesign name='left' size={30} color={'#333'} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={detailStyles.labelAttrsDetail}>
                    <Text style={{ color: '#000', fontSize: 24, fontWeight: 'bold' }}>详细属性</Text>
                </View>
                <ScrollView style={{  }}>
                    <View style={detailStyles.attrsDetailContainer}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            source={require('../../../assets/bg/role_detail_attrs_bg.png')}
                            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                        />
                        <View style={detailStyles.attrsDetailLabel}><Text style={{ color: '#000', fontSize: 24 }}>基础属性</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 5</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 4</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 3</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 2</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 1</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 10</Text></View>
                        </View>
                    </View>
                    <View style={detailStyles.attrsDetailContainer}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            source={require('../../../assets/bg/role_detail_attrs_bg.png')}
                            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                        />
                        <View style={detailStyles.attrsDetailLabel}><Text style={{ color: '#000', fontSize: 24 }}>攻击属性</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 5</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 4</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 3</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 2</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 1</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 10</Text></View>
                        </View>
                    </View>
                    <View style={detailStyles.attrsDetailContainer}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            source={require('../../../assets/bg/role_detail_attrs_bg.png')}
                            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                        />
                        <View style={detailStyles.attrsDetailLabel}><Text style={{ color: '#000', fontSize: 24 }}>防御属性</Text></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 5</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 4</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 3</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 2</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 1</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 10</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 10</Text></View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const RoleSimpleSection = (props) => {
    const onDetailHandler = () => {
        const key = RootView.add(<RoleAttrsDetailPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    return (
        <>
            <View style={styles.roleNameContainer}>
                <View style={styles.roleName}>
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>李森炎</Text>
                </View>
            </View>
            <View style={styles.progressBarContainer}>
                <Text>体力:</Text>
                <View style={styles.progressBarView}>
                    <View style={styles.progressBarBody} />
                    <Text style={styles.progressBarText}>300/1000</Text>
                </View>
            </View>
            <View style={styles.progressBarContainer}>
                <Text>法力:</Text>
                <View style={styles.progressBarView}>
                    <View style={styles.progressBarBody} />
                    <Text style={styles.progressBarText}>300/1000</Text>
                </View>
            </View>
            <View style={styles.attrsContainer}>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>普通攻击:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>10000</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术攻击:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>10000</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>普通防御:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>10000</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术防御:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>10000</Text></View>
                </View>
            </View>
            <View style={styles.detailContainer}>
                <View style={styles.detailButtonView}>
                    <TextButton title={'详细'} onPress={onDetailHandler} />
                </View>
            </View>
        </>
    );
}

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
                DeviceEventEmitter.emit('__@EquipSelector.select', { tag: props.tag, equip: data.item });
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

const EquipPlaceHolder = (props) => {

    const [equipName, setEquipName] = React.useState(props.tag);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@EquipSelector.select', ({ tag, equip }) => {
            if (lo.isEqual(tag, props.tag)) {
                setEquipName(equip.name);
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => {
            const key = RootView.add(<EquipSelector tag={props.tag} onClose={() => {
                RootView.remove(key);
            }} />);
        }}>
            <View style={equipStyles.equipItem}>
                <Text style={{ color: '#000', fontSize: 16 }}>{equipName}</Text>
                <View style={{ position: 'absolute', right: 0 }}>
                    <AntDesign name='plus' size={23} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const RoleEquipSection = (props) => {
    return (
        <View style={equipStyles.viewContainer}>
            <EquipPlaceHolder tag={'武器'} />
            <EquipPlaceHolder tag={'衣装'} />
            <EquipPlaceHolder tag={'防具'} />
            <EquipPlaceHolder tag={'其他'} />
            <EquipPlaceHolder tag={'饰品1'} />
            <EquipPlaceHolder tag={'饰品2'} />
            <EquipPlaceHolder tag={'法宝'} />
        </View>
    );
}

const RoleTabPage = (props) => {

    return (
        <View style={styles.viewContainer}>
            <RoleSimpleSection />
            <RoleEquipSection />
        </View>
    );

}

const styles = StyleSheet.create({

    viewContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    roleNameContainer: {
        width: '94%',
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        // backgroundColor: '#669900',
    },

    roleName: {
        width: 180,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#666',
        backgroundColor: '#ccc',
    },

    progressBarContainer: {
        width: '94%',
        height: 40,
        // backgroundColor: '#669900',
    },

    progressBarView: {
        width: 180,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 6,
        alignItems: 'center',
        overflow: 'hidden',
    },

    progressBarBody: {
        position: 'absolute',
        left: -180,
        width: 180,
        height: '100%',
        transform: [{ translateX: 60 }],
        backgroundColor: '#669900',
    },

    progressBarText: {
        color: '#000',
    },

    attrsContainer: {
        width: '94%',
        marginTop: 20,
        // backgroundColor: '#669900',
    },

    attrsItemView: {
        flexDirection: 'row',
        marginTop: 3,
        marginBottom: 3,
    },

    attrsItemLeft: {
        width: 80,
        height: 28,
        // alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#669900',
    },

    attrsItemRight: {
        width: 100,
        height: 28,
        marginLeft: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#666',
        backgroundColor: '#eee',
    },

    attrsItemText: {
        color: '#000',
    },

    detailContainer: {
        width: '94%',
        height: 40,
        marginTop: 20,
        justifyContent: 'center',
        // backgroundColor: '#669900',
    },

    detailButtonView: {
        width: 180,
    },
});

const detailStyles = StyleSheet.create({
    viewContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b8b6b0',
    },
    bodyContainer: {
        width: '90%',
        height: '90%',
        alignItems: 'center',
        // backgroundColor: '#669900',
    },
    closeButtonView: {
        position: 'absolute',
        left: 5,
        top: 5,
        zIndex: 100,
    },
    labelAttrsDetail: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    attrsDetailContainer: {
        width: '100%',
        height: 'auto',
        marginTop: 50,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        backgroundColor: '#e1e1df',
    },
    attrsDetailLabel: {
        position: 'absolute',
        top: -35,
        left: 5,
    },
    attrsDetailItem: {
        width: '40%',
        height: 30,
        justifyContent: 'center',
        marginLeft: 15,
        // backgroundColor: '#669900',
    },
    attrsDetailText: {
        color: '#000',
    },
});

const equipStyles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        right: 0, 
        // backgroundColor: 'rgba(128,128,128,0.5)', 
        width: WIN_SIZE.width / 2, 
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    equipItem: {
        width: 120, 
        height: 30, 
        borderWidth: 1, 
        borderColor: '#4d4b49', 
        borderRadius: 10, 
        flexDirection: 'row',
        backgroundColor: '#b7b2ad',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 10,
    },
});

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

export default connect((state) => ({ ...state.AppModel }))(RoleTabPage);
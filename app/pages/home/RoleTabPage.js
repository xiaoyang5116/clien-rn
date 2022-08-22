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
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { 
    DeviceEventEmitter,
    ScrollView, 
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCapInset from 'react-native-image-capinsets-next';
import EquippedSideBar from '../../components/equips/EquippedSideBar';
import XiuXingTabPage from './XiuXingTabPage';

const AttrsPage = (props) => {
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
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 0</Text></View>
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
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 0</Text></View>
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
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>气血： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>真元： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>神识： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>移动速度： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>体魄： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>身法： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>内息： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>跨界心魔： 0</Text></View>
                            <View style={detailStyles.attrsDetailItem}><Text style={detailStyles.attrsDetailText}>心魔： 0</Text></View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const SimpleInfo = (props) => {

    const [affects, setAffects] = React.useState([]);

    const updateHandler = () => {
        AppDispath({ type: 'UserModel/getEquipsEntity', payload: { }, cb: (v) => {
            if (!lo.isArray(v))
                return

            const allAffects = [];
            v.forEach(e => {
                allAffects.push(...e.affect);
            });

            setAffects(allAffects);
        }});
    }

    React.useEffect(() => {
        updateHandler();
        const listener = DeviceEventEmitter.addListener(EventKeys.USER_EQUIP_UPDATE, () => {
            updateHandler();
        });
        return () => {
            listener.remove();
        }
    }, []);

    const onDetailHandler = () => {
        const key = RootView.add(<AttrsPage onClose={() => {
            RootView.remove(key);
        }} />);
    }

    const getAffectValue = (array, key) => {
        if (!lo.isArray(array) || array.length <= 0)
            return 0;
        
        let total = 0;
        array.forEach(e => {
            if (lo.isEqual(e.key, key)) {
                total += e.value;
            }
        });
        return total;
    }

    const tiLi = getAffectValue(affects, '体力');
    const faLi = getAffectValue(affects, '法力');
    const puTongGongJi = getAffectValue(affects, '普通攻击');
    const faShuGongJi = getAffectValue(affects, '法术攻击');
    const puTongFangYu = getAffectValue(affects, '普通防御');
    const faShuFangYu = getAffectValue(affects, '法术防御');

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
                    <View style={[styles.progressBarBody, { transform: [{ translateX: (tiLi / 1000) * 180 }] }]} />
                    <Text style={styles.progressBarText}>{tiLi}</Text>
                </View>
            </View>
            <View style={styles.progressBarContainer}>
                <Text>法力:</Text>
                <View style={styles.progressBarView}>
                <View style={[styles.progressBarBody, { transform: [{ translateX: (faLi / 1000) * 180 }] }]} />
                    <Text style={styles.progressBarText}>{faLi}</Text>
                </View>
            </View>
            <View style={styles.attrsContainer}>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>普通攻击:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{puTongGongJi}</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术攻击:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{faShuGongJi}</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>普通防御:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{puTongFangYu}</Text></View>
                </View>
                <View style={styles.attrsItemView}>
                    <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术防御:</Text></View>
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{faShuFangYu}</Text></View>
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

const FuncButtons = (props) => {

    const openXiuXing = () => {
        const key = RootView.add(<XiuXingTabPage onClose={() => {
            RootView.remove(key);
        }} />)
    }

    return (
    <View style={fbStyles.viewContainer}>
        <View style={fbStyles.box}>
            <TextButton style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} title={'修行'} onPress={() => openXiuXing()} />
        </View>
        <View style={fbStyles.box}>
            <TextButton disabled={true} style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} title={'解锁'} />
        </View>
        <View style={fbStyles.box}>
            <TextButton disabled={true} style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} title={'解锁'} />
        </View>
    </View>
    );
}

const RoleTabPage = (props) => {
    return (
        <View style={styles.viewContainer}>
            <SimpleInfo />
            <EquippedSideBar />
            <FuncButtons />
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

const fbStyles = StyleSheet.create({
    viewContainer: {
        position: 'absolute', 
        bottom: 50, 
        width: '100%', 
        height: 100, 
        paddingLeft: 10,
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        flexDirection: 'row',
    }, 
    box: {
        margin: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});

export default connect((state) => ({ ...state.AppModel }))(RoleTabPage);
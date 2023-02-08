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
    TouchableOpacity
} from 'react-native';

import lo from 'lodash';
import { TextButton } from '../../constants/custom-ui';
import RootView from '../../components/RootView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageCapInset from 'react-native-image-capinsets-next';
import EquippedSideBar from '../../components/equips/EquippedSideBar';
import XiuXingTabPage from './XiuXingTabPage';
import Transitions from '../../components/transition';
import GongFa from '../../components/gongFa';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

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
                <ScrollView style={{}}>
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
        AppDispath({
            type: 'UserModel/getFinalAttrs', payload: {}, cb: (v) => {
                if (!lo.isArray(v))
                    return
                setAffects(v);
            }
        });
    }

    React.useEffect(() => {
        updateHandler();
        const listener = DeviceEventEmitter.addListener(EventKeys.USER_ATTR_UPDATE, () => {
            updateHandler();
        });
        return () => {
            listener.remove();
        }
    }, []);

    const onDetailHandler = () => {
        const key = RootView.add(
            <AttrsPage onClose={() => { RootView.remove(key) }} />
        );
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

    const tiLi = getAffectValue(affects, 'hp');
    const faLi = getAffectValue(affects, 'mp');
    const wuLiGongJi = getAffectValue(affects, 'physicalAttack');
    const faShuGongJi = getAffectValue(affects, 'magicAttack');
    const puTongFangYu = getAffectValue(affects, 'physicalDefense');
    const faShuFangYu = getAffectValue(affects, 'magicDefense');

    return (
        <View style={{ width: "45%" }}>
            <View style={styles.roleNameContainer}>
                <Text style={{ color: '#6C7682', fontSize: 28 }}>李森炎</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <Text style={{ fontSize: 14, color: "#596068" }}>体力:</Text>
                <View style={styles.progressBarView}>
                    <FastImage style={styles.progressBarBG} source={require('../../../assets/character/attr_bg.png')} />
                    <FastImage style={[styles.progressBarBody, { width: (tiLi / 1000) * px2pd(500) }]} source={require('../../../assets/character/tiLi_bar.png')} />
                    <Text style={styles.progressBarText}>{tiLi}/1000</Text>
                </View>
            </View>
            <View style={styles.progressBarContainer}>
                <Text style={{ fontSize: 14, color: "#596068" }}>法力:</Text>
                <View style={styles.progressBarView}>
                    <FastImage style={styles.progressBarBG} source={require('../../../assets/character/attr_bg.png')} />
                    {/* <View style={[styles.progressBarBody, { transform: [{ translateX: (faLi / 1000) * 180 }] }]} /> */}
                    <FastImage style={[styles.progressBarBody, { width: (faLi / 1000) * px2pd(500) }]} source={require('../../../assets/character/faLi_bar.png')} />
                    <Text style={styles.progressBarText}>{faLi}/1000</Text>
                </View>
            </View>
            <View style={styles.attrsContainer}>
                <View style={styles.attrsItemView}>
                    {/* <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>物理攻击:</Text></View> */}
                    <FastImage style={styles.attrsItemLeft} source={require('../../../assets/character/ptgj.png')} />
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{wuLiGongJi}</Text></View>
                    <FastImage style={{ position: "absolute", bottom: 0, width: "100%", height: px2pd(3) }} source={require('../../../assets/character/line.png')} />
                </View>
                <View style={styles.attrsItemView}>
                    {/* <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术攻击:</Text></View> */}
                    <FastImage style={styles.attrsItemLeft} source={require('../../../assets/character/fsgj.png')} />
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{faShuGongJi}</Text></View>
                    <FastImage style={{ position: "absolute", bottom: 0, width: "100%", height: px2pd(3) }} source={require('../../../assets/character/line.png')} />
                </View>
                <View style={styles.attrsItemView}>
                    {/* <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>物理防御:</Text></View> */}
                    <FastImage style={styles.attrsItemLeft} source={require('../../../assets/character/ptfy.png')} />
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{puTongFangYu}</Text></View>
                    <FastImage style={{ position: "absolute", bottom: 0, width: "100%", height: px2pd(3) }} source={require('../../../assets/character/line.png')} />
                </View>
                <View style={styles.attrsItemView}>
                    {/* <View style={styles.attrsItemLeft}><Text style={styles.attrsItemText}>法术防御:</Text></View> */}
                    <FastImage style={styles.attrsItemLeft} source={require('../../../assets/character/fsfy.png')} />
                    <View style={styles.attrsItemRight}><Text style={styles.attrsItemText}>{faShuFangYu}</Text></View>
                    <FastImage style={{ position: "absolute", bottom: 0, width: "100%", height: px2pd(3) }} source={require('../../../assets/character/line.png')} />
                </View>
            </View>
            <View style={styles.detailContainer}>
                <TouchableOpacity onPress={onDetailHandler}>
                    <FastImage style={{ width: px2pd(145), height: px2pd(55) }} source={require('../../../assets/character/detail.png')} />
                </TouchableOpacity>
                {/* <View style={styles.detailButtonView}>
                    <TextButton title={'详细'} onPress={onDetailHandler} />
                </View> */}
            </View>
        </View>
    );
}

const FuncButtons = (props) => {

    const openXiuXing = () => {
        const key = RootView.add(
            <Transitions id={'OPEN_XIUXING_UI'}>
                <XiuXingTabPage onClose={() => { RootView.remove(key); }} />
            </Transitions>);
    }

    const openGongFa = () => {
        GongFa.show();
    }

    return (
        <View style={fbStyles.viewContainer}>
            <View style={fbStyles.box}>
                <TouchableOpacity onPress={openXiuXing}>
                    <FastImage style={{ width: px2pd(204), height: px2pd(206) }} source={require('../../../assets/character/xiulian.png')} />
                </TouchableOpacity>
                {/* <TextButton style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} title={'修行'} onPress={() => openXiuXing()} /> */}
            </View>
            <View style={fbStyles.box}>
                <TouchableOpacity onPress={openGongFa}>
                    <FastImage style={{ width: px2pd(167), height: px2pd(193) }} source={require('../../../assets/character/gongfa.png')} />
                </TouchableOpacity>
                {/* <TextButton style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} onPress={openGongFa} title={'功法'} /> */}
            </View>
            <View style={fbStyles.box}>
                <TouchableOpacity>
                    <FastImage style={{ width: px2pd(169), height: px2pd(195) }} source={require('../../../assets/character/lingeng.png')} />
                </TouchableOpacity>
            </View>
            <View style={fbStyles.box}>
                <TouchableOpacity>
                    <FastImage style={{ width: px2pd(181), height: px2pd(190) }} source={require('../../../assets/character/jianxia.png')} />
                </TouchableOpacity>
            </View>
            {/* <View style={fbStyles.box}>
                <TextButton disabled={true} style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }} title={'解锁'} />
            </View> */}
        </View>
    );
}

const RoleTabPage = (props) => {
    return (
        <View style={styles.viewContainer}>
            <View style={{ flexDirection: 'row', width: "100%", justifyContent: "space-between", paddingLeft: 12, paddingRight: 12 }}>
                <SimpleInfo />
                <EquippedSideBar />
            </View>
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
        marginTop: 10,
        marginBottom: 10,
    },

    roleName: {

    },

    progressBarContainer: {
        width: '94%',
        height: 40,
    },

    progressBarView: {
        width: px2pd(500),
        height: px2pd(45),
        alignItems: 'center',
        justifyContent: "center",
        overflow: 'hidden',
    },
    progressBarBG: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 0
    },

    progressBarBody: {
        position: 'absolute',
        left: 2,
        height: '71%',
    },

    progressBarText: {
        color: '#000',
    },

    attrsContainer: {
        width: '94%',
        marginTop: 20,
    },

    attrsItemView: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 3,
        marginBottom: 3,
    },

    attrsItemLeft: {
        width: px2pd(144),
        height: px2pd(33),
    },

    attrsItemRight: {
        width: 100,
        height: 28,
        marginLeft: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    attrsItemText: {
        color: '#000',
    },

    detailContainer: {
        width: px2pd(145),
        height: px2pd(55),
        marginTop: 20,
        justifyContent: 'center',
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
    },
    closeButtonView: {
        position: 'absolute',
        left: -6,
        top: 5,
        zIndex: 100,
    },
    labelAttrsDetail: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    attrsDetailText: {
        color: '#000',
    },
});

const fbStyles = StyleSheet.create({
    viewContainer: {
        width: '100%',
        marginTop: 20,
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
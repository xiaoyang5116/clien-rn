import React, { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import lo from 'lodash';

import {
    action,
    connect,
    StyleSheet,
    DeviceEventEmitter,
    EventKeys
} from "../../constants";

import {
    RenderHTML
} from 'react-native-render-html';

import ProgressBar from '../../components/ProgressBar';
import { View, Text, FlatList } from '../../constants/native-ui';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';
import { ImageBackground, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { px2pd } from '../../constants/resolution';

const BuffCollapsible = (props) => {

    const [collapsed, setCollapsed] = React.useState(props.defaultCollapsed);
    const [width, setWidth] = React.useState(0);

    const onLayout = ({ nativeEvent }) => {
        const { width } = nativeEvent.layout;
        setWidth(width);
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            setCollapsed((v) => {
                return !v;
            });
        }}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} onLayout={onLayout}>
                <View style={{ marginBottom: 5, backgroundColor: 'rgba(181,169,180,1.0)', width: '98%', height: px2pd(80), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: '#000', fontWeight: 'bold' }}>Buff</Text>
                    {
                        (collapsed)
                            ? <AntDesign name='doubleright' size={16} style={{ position: 'absolute', right: 10, transform: [{ rotate: '90deg' }] }} />
                            : <AntDesign name='doubleright' size={16} style={{ position: 'absolute', right: 10, transform: [{ rotate: '-90deg' }] }} />
                    }
                </View>
                <Collapsible collapsed={collapsed} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        lo.map(props.data.buffs, (e, k) => {
                            return (
                                <View key={k} style={{ marginBottom: 5, backgroundColor: 'rgba(181,169,180,1.0)', width: '98%', height: px2pd(80), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: '#333' }}>{e.name}</Text>
                                </View>
                            );
                        })
                    }
                </Collapsible>
            </View>
        </TouchableWithoutFeedback>
    );
}

const ActionMsgItem = (props) => {
    const isMyself = (props.user.uid == props.data.attackerUid);

    return (
        <View style={{ borderWidth: 2, borderColor: '#ccc', borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', margin: 5 }}>
            <View style={{ width: '100%', height: px2pd(80), backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <RenderHTML contentWidth={100} source={{ html: `${props.data.attackerName} 的攻击` }} />
                </View>
                <View style={{ position: 'absolute', right: px2pd(200) }}>
                    {(props.data.crit) ? <Text style={{ color: '#ff0817' }}>[暴击]</Text> : <></>}
                </View>
                {
                    (isMyself)
                        ? <AntDesign style={{ position: 'absolute', right: 5 }} name='arrowright' color={'#333'} size={25} />
                        : <AntDesign style={{ position: 'absolute', left: 5 }} name='arrowleft' color={'#333'} size={25} />
                }
            </View>
            <View style={{ marginTop: 5, marginBottom: 5, backgroundColor: 'rgba(148,148,186,0.5)', width: '98%', height: px2pd(80), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {(props.data.physicalDamage != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>物伤：{props.data.physicalDamage}</Text> : <></>}
                {(props.data.magicDamage != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>法伤：{props.data.magicDamage}</Text> : <></>}
                {(props.data.rechargeHP != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>治疗：{props.data.rechargeHP}</Text> : <></>}
                {(props.data.rechargeMP != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>法力：{props.data.rechargeMP}</Text> : <></>}
            </View>
            {
                lo.map(props.data.skills, (e, k) => {
                    return (
                        <View key={k} style={{ marginBottom: 5, backgroundColor: 'rgba(238,213,185,0.3)', width: '98%', height: px2pd(80), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#333' }}>{e.name}</Text>
                            {(e.passive) ? <Text style={{ marginLeft: 5, color: '#fff' }}>(被动)</Text> : <></>}
                        </View>
                    );
                })
            }
            {(props.data.buffs.length > 0) ? <BuffCollapsible data={props.data} defaultCollapsed={(props.data.skills.length + props.data.buffs.length) > 2} /> : <></>}
        </View>
    )
}

const TextMsgItem = (props) => {
    const htmlMsg = '<li style="color: #ffffff">{0}</li>'.format(props.data.msg);
    return (
        <View style={{ height: px2pd(60), justifyContent: 'center', alignItems: 'center', margin: 5 }}>
            <RenderHTML contentWidth={100} source={{ html: htmlMsg }} />
        </View>
    )
}

const Character = (props, ref) => {
    const [hpPercent, setHpPercent] = React.useState(0);
    const [mpPercent, setMpPercent] = React.useState(0);
    const [shieldPercent, setShieldPercent] = React.useState(0);

    useImperativeHandle(ref, () => ({
        update: (data) => {
            // 更新角色血条/蓝条
            if (data.attackerUid != undefined && data.defenderUid != undefined) {
                if (props.user.uid == data.attackerUid) {
                    setHpPercent((data.attackerHP / data.attackerOrgHP) * 100);
                    setMpPercent((data.attackerMP / data.attackerOrgMP) * 100);
                    setShieldPercent((data.attackerShield / data.attackerOrgShield) * 100);
                } else {
                    setHpPercent((data.defenderHP / data.defenderOrgHP) * 100);
                    setMpPercent((data.defenderMP / data.defenderOrgMP) * 100);
                    setShieldPercent((data.defenderShield / data.defenderOrgShield) * 100);
                }
            }
        },
    }));

    if (props.user == undefined) {
        return (<></>);
    }

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', height: px2pd(395) }, (props.contentStyle != undefined) ? props.contentStyle : {}]}>
            <FastImage
                style={{ height: px2pd(395), width: px2pd(1080), position: 'absolute', top: 0 }}
                source={require('../../../assets/arenaPage/attr_bg2.png')}
            />
            {/* <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}> */}
            <View style={{ width: px2pd(232), height: 90, marginLeft: 15, marginRight: 5, justifyContent: "flex-end", alignItems: 'center' }}>
                <FastImage style={{ width: px2pd(210), height: px2pd(202) }} source={require('../../../assets/arenaPage/arena_character_bg.png')} />
                <ImageBackground style={{ width: px2pd(232), height: px2pd(52), position: "absolute", justifyContent: "center", alignItems: "center" }} source={require('../../../assets/arenaPage/name_bg.png')}>
                    <Text style={{ color: '#000' }}>{props.user.userName}</Text>
                </ImageBackground>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', height: 90, }}>
                <View style={{ height: 3, marginTop: 6, marginRight: 6, marginBottom: 0 }}>
                    <ProgressBar percent={shieldPercent} sections={[{ x: 0, y: 100, color: '#3390ff' }]} />
                </View>
                <View style={{ height: 12, marginTop: 0, marginRight: 6, marginBottom: 3 }}>
                    <ProgressBar percent={hpPercent} sections={[{ x: 0, y: 30, color: '#ff2600' }, { x: 30, y: 60, color: '#fbbb39' }, { x: 60, y: 100, color: '#ffd479' }]} />
                </View>
                <View style={{ height: 15, marginTop: 6, marginRight: 6, marginBottom: 6 }}>
                    <ProgressBar percent={mpPercent} sections={[{ x: 0, y: 100, color: '#12b7b5' }]} />
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, color: '#fff' }}>物攻: {props.user.attrs.physicalAttack || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>法攻: {props.user.attrs.magicAttack || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>物防: {props.user.attrs.physicalDefense || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>法防: {props.user.attrs.magicDefense || 0}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text style={{ flex: 1, color: '#fff' }}>速度: {props.user.attrs.speed || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>暴击: {props.user.attrs.crit || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>闪避: {props.user.attrs.dodge || 0}</Text>
                    <Text style={{ flex: 1, color: '#fff' }}>敏捷: {props.user.attrs.dodge || 0}</Text>
                </View> */}
            </View>
        </View>
    );
}
const CharacterWrapper = forwardRef(Character);

const ArenaPage = (props) => {
    const refList = React.createRef();
    const listData = React.useRef([]);
    const reportIndex = React.useRef(0);
    const status = React.useRef(0); //0: 正常, 1: 准备结束, 2: 已经结束
    const refCharacterEnemy = React.useRef(null);
    const refCharacterMysef = React.useRef(null);
    const [update, setUpdate] = React.useState({});

    const renderMsgItem = ({ item }) => {
        if (item.data.attackerUid != undefined && item.data.defenderUid != undefined) {
            return (<ActionMsgItem data={item.data} user={props.myself} />)
        } else {
            return (<TextMsgItem data={item.data} />);
        }
    }

    const closeHandler = () => {
        if (props.onClose != undefined) {
            const { myself, __data } = props
            if (__data.enemyQueue.length === 0
                && __data.enemyIndex >= __data.enemyQueue.length) {
                // 判断输赢
                DeviceEventEmitter.emit(
                    `${EventKeys.CHALLENGE_END_RESULT}_${__data.challengeId}`,
                    myself.attrs.hp > 0 ? true : false
                )
            }
            props.onClose();
        }

    }

    React.useEffect(() => {
        props.dispatch(action('ArenaModel/start')({ challengeId: props.challengeId }));
    }, []);

    React.useEffect(() => {
        let timer = null;
        if (props.report.length > 0) {
            if (reportIndex.current < props.report.length) {
                status.current = 0;
                timer = setTimeout(() => {
                    setUpdate({});
                }, 1000);
            } else {
                // listData.current.length = 0;
                status.current = 1;
                reportIndex.current = 0;
                props.dispatch(action('ArenaModel/over')());
            }
        }
        return () => {
            if (timer != null) {
                clearTimeout(timer);
            }
        }
    }, [props.report, update]);

    if (props.report.length > 0 && reportIndex.current < props.report.length) {
        const item = props.report[reportIndex.current];
        listData.current.push({ id: listData.current.length + 1, data: item });

        setTimeout(() => {
            if (refCharacterEnemy.current != null) {
                refCharacterEnemy.current.update(item);
            }
            if (refCharacterMysef.current != null) {
                refCharacterMysef.current.update(item);
            }
        }, 0);

        reportIndex.current += 1;
    }

    return (
        <View style={{ flex: 1 }}>
            <FastImage style={{ position: "absolute", width: "100%", height: "100%" }} source={require("../../../assets/arenaPage/bg.png")} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={props.currentStyles.viewContainer}>
                    {/* <View style={{ position: 'absolute', zIndex: 10, top: 0, left: px2pd(20) }}>
                    <AntDesign name='left' style={{ color: '#fff' }} size={30} onPress={closeHandler} />
                </View> */}
                    <CharacterWrapper ref={refCharacterEnemy} user={props.enemy} contentStyle={{ marginTop: 20 }} />
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#5a5a70' }}>
                        <FlatList
                            ref={refList}
                            data={listData.current}
                            renderItem={renderMsgItem}
                            keyExtractor={item => item.id}
                            onContentSizeChange={() => {
                                if (listData.current.length > 0 && status.current != 2) {
                                    refList.current.scrollToEnd({ animated: true });
                                    // 停止滚动
                                    if (status.current == 1) {
                                        status.current = 2;
                                    }
                                }
                            }}
                        />
                    </View>
                    <CharacterWrapper ref={refCharacterMysef} user={props.myself} />
                </View>
            </SafeAreaView>
        </View>

    );
}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80
    },
    buttonContainer: {
        width: 100,
        marginTop: 25,
    }
});

export default connect((state) => ({ ...state.AppModel, ...state.ArenaModel, user: { ...state.UserModel } }))(ArenaPage);
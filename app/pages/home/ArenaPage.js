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
import { ExitButton, ReturnButton } from '../../constants/custom-ui';

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
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 12, marginBottom: 12 }}>
            <View style={{ width: '100%', height: px2pd(84), alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {
                    (isMyself)
                        ? (
                            <>
                                <ImageBackground
                                    source={require('../../../assets/arenaPage/mySelf/gj_bg.png')}
                                    style={{ width: px2pd(1065), height: px2pd(205), justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <RenderHTML contentWidth={100} source={{ html: `${props.data.attackerName} 的攻击` }} /> */}
                                    <Text style={{ color: "#94604e", fontSize: 18 }}>{`${props.data.attackerName}的攻击`}</Text>
                                </ImageBackground>
                                <View style={{ position: 'absolute', right: px2pd(150), justifyContent: 'center', alignItems: 'center', }}>
                                    {/* {(props.data.crit) ? <Text style={{ color: '#ff0817' }}>[暴击]</Text> : <></>} */}
                                    {(props.data.crit) ? <FastImage style={{ width: px2pd(218), height: px2pd(123) }} source={require('../../../assets/arenaPage/baoJi.png')} /> : <></>}
                                </View>
                                <FastImage style={{ position: 'absolute', right: 5, width: px2pd(163), height: px2pd(92) }} source={require('../../../assets/arenaPage/mySelf/jian.png')} />
                            </>
                        )
                        : (
                            <>
                                <ImageBackground
                                    source={require('../../../assets/arenaPage/enemy/gj_bg.png')}
                                    style={{ width: px2pd(1065), height: px2pd(84), justifyContent: 'center', alignItems: 'center' }}>
                                    {/* <RenderHTML contentWidth={100} source={{ html: `${props.data.attackerName}的攻击` }} /> */}
                                    <Text style={{ color: "#21272b", fontSize: 18 }}>{`${props.data.attackerName}的攻击`}</Text>
                                </ImageBackground>
                                <View style={{ position: 'absolute', left: px2pd(150), justifyContent: 'center', alignItems: 'center', }}>
                                    {/* {(props.data.crit) ? <Text style={{ color: '#ff0817' }}>[暴击]</Text> : <></>} */}
                                    {(props.data.crit) ? <FastImage style={{ width: px2pd(218), height: px2pd(123) }} source={require('../../../assets/arenaPage/baoJi.png')} /> : <></>}
                                </View>
                                <FastImage style={{ position: 'absolute', left: 5, width: px2pd(161), height: px2pd(88) }} source={require('../../../assets/arenaPage/enemy/jian.png')} />
                            </>

                        )
                }
            </View>
            <View style={{ marginTop: isMyself ? 3 : 2, marginBottom: 1, width: '98%', height: px2pd(80), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <FastImage source={require('../../../assets/arenaPage/di.png')} style={{ position: 'absolute', width: px2pd(1065), height: px2pd(76) }} />
                {(props.data.physicalDamage != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>物伤：{props.data.physicalDamage}</Text> : <></>}
                {(props.data.magicDamage != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>法伤：{props.data.magicDamage}</Text> : <></>}
                {(props.data.rechargeHP != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>治疗：{props.data.rechargeHP}</Text> : <></>}
                {(props.data.rechargeMP != 0) ? <Text style={{ color: '#fff', marginLeft: 5, marginRight: 5 }}>法力：{props.data.rechargeMP}</Text> : <></>}
            </View>
            {
                lo.map(props.data.skills, (e, k) => {
                    return (
                        <View key={k} style={{ marginBottom: 1, width: '98%', height: px2pd(80), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <FastImage source={require('../../../assets/arenaPage/di.png')} style={{ position: 'absolute', width: px2pd(1065), height: px2pd(76), zIndex: 0 }} />
                            <Text style={{ color: '#fff' }}>{e.name}</Text>
                            {(e.passive) ? <Text style={{ marginLeft: 5, color: '#fff', }}>(被动)</Text> : <></>}
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
        <View style={{ height: px2pd(76), justifyContent: "center", alignItems: "flex-start", margin: 5, paddingLeft: 20 }}>
            <FastImage style={{ position: "absolute", height: px2pd(76), width: px2pd(1072) }} source={require('../../../assets/arenaPage/TextMsg_bg.png')} />
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
        <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', height: px2pd(282), alignItems: "center" }, (props.contentStyle != undefined) ? props.contentStyle : {}]}>
            <FastImage
                style={{ height: px2pd(359), width: px2pd(1080), position: 'absolute', top: 0 }}
                source={require('../../../assets/arenaPage/attr_bg2.png')}
            />
            {/* <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}> */}
            <View style={{ width: px2pd(232), marginLeft: 15, marginRight: 5, justifyContent: "flex-end", alignItems: 'center' }}>
                <FastImage style={{ width: px2pd(210), height: px2pd(202) }} source={require('../../../assets/arenaPage/arena_character_bg.png')} />
                <ImageBackground style={{ width: px2pd(232), height: px2pd(52), position: "absolute", justifyContent: "center", alignItems: "center" }} source={require('../../../assets/arenaPage/name_bg.png')}>
                    <Text style={{ color: '#000' }}>{props.user.userName}</Text>
                </ImageBackground>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', paddingTop: 30, alignItems: 'center' }}>
                <View style={{ height: px2pd(49), marginTop: 6, marginRight: 6, flexDirection: 'row' }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>护盾: </Text>
                    <ImageBackground style={{ width: px2pd(581), height: px2pd(49), }} source={require("../../../assets/arenaPage/xueliang.png")}>
                        <View style={{ borderRadius: 12, width: "100%", height: "100%", overflow: "hidden", padding: 3 }}>
                            <ProgressBar percent={shieldPercent} sections={[{ x: 0, y: 100, color: '#3390ff' }]} />
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ height: px2pd(49), marginTop: 6, marginRight: 6, flexDirection: 'row' }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>血量: </Text>
                    <ImageBackground style={{ width: px2pd(581), height: px2pd(49), }} source={require("../../../assets/arenaPage/xueliang.png")}>
                        <View style={{ borderRadius: 12, width: "100%", height: "100%", overflow: "hidden", padding: 3 }}>
                            <ProgressBar percent={hpPercent} sections={[{ x: 0, y: 30, color: '' }, { x: 30, y: 60, color: '#fbbb39' }, { x: 60, y: 100, color: '#ffd479' }]} />
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ height: px2pd(49), marginTop: 6, marginRight: 6, flexDirection: 'row' }}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>法力: </Text>
                    <ImageBackground style={{ width: px2pd(581), height: px2pd(49) }} source={require("../../../assets/arenaPage/xueliang.png")}>
                        <View style={{ borderRadius: 12, width: "100%", height: "100%", overflow: "hidden", padding: 3 }}>
                            <ProgressBar percent={mpPercent} sections={[{ x: 0, y: 100, color: '#12b7b5' }]} />
                        </View>
                    </ImageBackground>
                </View>
                <View style={{ height: 15, marginTop: 6, marginRight: 6, marginBottom: 6 }}>
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
                    <CharacterWrapper ref={refCharacterEnemy} user={props.enemy} contentStyle={{}} />
                    <View style={{ flex: 1, flexDirection: 'row', }}>
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
                    <View style={{ width: "100%", justifyContent: "flex-start", }}>
                        <ReturnButton onPress={closeHandler} />
                    </View>
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
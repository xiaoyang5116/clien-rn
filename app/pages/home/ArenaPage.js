import React, { forwardRef } from 'react';

import {
    action,
    connect,
    StyleSheet,
} from "../../constants";

import {
    RenderHTML
} from 'react-native-render-html';

import ProgressBar from '../../components/ProgressBar';
import { View, Text, FlatList } from '../../constants/native-ui';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native';
import { px2pd } from '../../constants/resolution';
import { useImperativeHandle } from 'react';

const MsgItem = (props) => {
    return (
        <View style={{ height: 20, justifyContent: 'center', margin: 5, paddingLeft: 5 }}>
            <RenderHTML contentWidth={100} source={{html: props.msg}} />
        </View>
    )
}

const Character = (props, ref) => {
    const [lifePercent, setLifePercent] = React.useState(0);

    useImperativeHandle(ref, () => ({
        update: (data) => {
            // 更新角色血条
            if (data.attackerUid != undefined && data.defenderUid != undefined) {
                if (props.user.uid == data.attackerUid) {
                    setLifePercent((data.attackerLife / data.attackerOrgLife) * 100);
                } else {
                    setLifePercent((data.defenderLife / data.defenderOrgLife) * 100);
                }
            }
        },
    }));

    return (
    <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }, (props.contentStyle != undefined) ? props.contentStyle : {}]}>
        <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  }}>
            <FastImage style={{ width: px2pd(218), height: px2pd(211) }} source={require('../../../assets/bg/arena_character_bg.png')} />
            <Text style={{ position: 'absolute', color: '#000' }}>{props.user.userName}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <View style={{ height: 3, marginTop: 6, marginRight: 6, marginBottom: 0 }}>
                <ProgressBar percent={50} sections={[{x: 0, y: 100, color: '#3390ff'}]} />
            </View>
            <View style={{ height: 12, marginTop: 0, marginRight: 6, marginBottom: 3 }}>
                <ProgressBar percent={lifePercent} />
            </View>
            <View style={{ height: 15, marginTop: 6, marginRight: 6, marginBottom: 6 }}>
                <ProgressBar percent={props.user.power / 1000 * 100} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ color: '#fff' }}>攻击: {props.user.power}</Text>
                <Text style={{ color: '#fff' }}>速度: {props.user.speed}</Text>
                <Text style={{ color: '#fff' }}>暴击: {props.user.crit}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text style={{ color: '#fff' }}>敏捷: {props.user.agile}</Text>
                <Text style={{ color: '#fff' }}>防御: {props.user.defense}</Text>
                <Text style={{ color: '#fff' }}>闪避: {props.user.dodge}</Text>
            </View>
        </View>
    </View>
    );
}
const CharacterWrapper = forwardRef(Character);

const ArenaPage = (props) => {
    const refList = React.createRef();
    const listData = React.useRef([]);
    const reportIndex = React.useRef(0);
    const refCharacterEnemy = React.useRef(null);
    const refCharacterMysef = React.useRef(null);
    const [update, setUpdate] = React.useState({});

    const renderMsgItem = (data) => {
        return (<MsgItem msg={data.item.msg} />)
    }

    React.useEffect(() => {
        props.dispatch(action('ArenaModel/start')({ seqId: 'x1' }));
    }, []);

    React.useEffect(() => {
        let timer = null;
        if (props.report.length > 0) {
            if (reportIndex.current < props.report.length) {
                timer = setTimeout(() => {
                    setUpdate({});
                }, 600);
            } else {
                // listData.current.length = 0;
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
        listData.current.push({ id: listData.current.length + 1, msg: '<li style="color: #ffffff">{0}</li>'.format(item.msg) });

        setTimeout(() => {
            refCharacterEnemy.current.update(item);
            refCharacterMysef.current.update(item);
        }, 0);

        reportIndex.current += 1;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#403340' }}>
            <View style={props.currentStyles.viewContainer}>
                <View style={{ position: 'absolute', zIndex: 10, top: 0, left: px2pd(20) }}>
                    <AntDesign name='left' style={{ color: '#fff' }} size={30} onPress={() => {
                        if (props.onClose != undefined) {
                            props.onClose();
                        }
                    }} />
                </View>
                <CharacterWrapper ref={refCharacterEnemy} user={props.enemy} contentStyle={{ marginTop: px2pd(80) }} />
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#5a5a70' }}>
                    <FlatList
                        ref={refList}
                        data={listData.current}
                        renderItem={renderMsgItem}
                        keyExtractor={item => item.id}
                        onContentSizeChange={() => {
                            if (listData.current.length > 0) {
                                refList.current.scrollToEnd({ animated: true });
                            }
                        }}
                    />
                </View>
                <CharacterWrapper ref={refCharacterMysef} user={props.myself} />
            </View>
        </SafeAreaView>
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
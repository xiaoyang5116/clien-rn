import React from 'react';
import { ImageBackground } from 'react-native';

import {
    action,
    connect,
    StyleSheet,
    ThemeContext,
    ScrollView,
    getPropIcon,
    DEBUG_MODE,
} from "../../constants";

import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from '../../constants/native-ui';

import {
    ReturnButton,
    TabButton, TextButton,
} from '../../constants/custom-ui';

import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import RootView from '../../components/RootView';
import PropTips from '../../components/tips/PropTips';
import WorldUtils from '../../utils/WorldUtils';
import qualityStyle from '../../themes/qualityStyle';
import { confirm } from '../../components/dialog';

const worldBtnBgData = [
    { id: 0, img: require('../../../assets/button/world_0_btn.png') },
    { id: 1, img: require('../../../assets/button/world_1_btn.png') },
    { id: 2, img: require('../../../assets/button/world_2_btn.png') },
]
const WorldButton = (props) => {
    const worldId = WorldUtils.getWorldIdByName(props.name);
    const img = worldBtnBgData.find(item => item.id === worldId).img

    const onSelected = (worldId) => {
        props.dispatch(action('PropsModel/filter')({ type: '', worldId: worldId }));
        if (props.onWorldChanged != undefined) {
            props.onWorldChanged(worldId);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={() => onSelected(worldId)}>
                <FastImage style={{
                    width: px2pd(260),
                    height: px2pd(160),
                    opacity: (props.user.worldId != worldId) ? 0.6 : 1,
                }} source={img} />
            </TouchableOpacity>
            {/* <TextButton title={props.name} onPress={() => onSelected(worldId)} /> */}
            {/* {
                (props.user.worldId != worldId)
                    ? (<View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} pointerEvents='none' />)
                    : <></>
            } */}
        </View >
    )
}

const PropTabButton = ({ title, style, onPress }) => {
    return (
        <View style={style}>
            <TouchableOpacity onPress={onPress} style={{ overflow: "hidden" }}>
                <ImageBackground
                    style={{ width: px2pd(160), height: px2pd(88), justifyContent: 'center', alignItems: "center" }}
                    source={require('../../../assets/button/propPage_btnBg.png')}
                >
                    <Text style={{ fontSize: 16, color: "#000" }}>{title}</Text>
                </ImageBackground>
            </TouchableOpacity>
        </View>

    )
}

const PropsPage = (props) => {

    const theme = React.useContext(ThemeContext);
    const [selectId, setSelectId] = React.useState(-1);

    React.useEffect(() => {
        props.dispatch(action('PropsModel/filter')({ type: '', worldId: props.user.worldId }));
    }, []);

    const typeFilter = (type) => {
        props.dispatch(action('PropsModel/filter')({ type: type, worldId: props.worldId }));
    }

    const testHandler = () => {
        confirm(`在 [${WorldUtils.getWorldNameById(props.user.worldId)}] 批量发放所有道具*10`, () => {
            props.dispatch(action('PropsModel/test')());
        });
    }

    const propSelected = (data) => {
        setSelectId(data.index);
        setTimeout(() => {
            const key = RootView.add(<PropTips propId={data.item.id} onClose={() => {
                RootView.remove(key);
            }} />);
        }, 0);
    }

    const renderItem = (data) => {
        const quality_style = qualityStyle.styles.find(e => e.id == parseInt(data.item.quality));
        const image = getPropIcon(data.item.iconId);
        return (
            <TouchableOpacity onPress={() => propSelected(data)} activeOpacity={1}>
                <View style={[styles.propsItem, (data.index == 0) ? styles.propsTopBorder : {}]}>
                    {(selectId == data.index) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={theme.propSelectedImage} /> : <></>}
                    <View style={styles.propsBorder}>
                        <View style={{}}>
                            <FastImage style={{
                                width: px2pd(100), height: px2pd(100),
                                borderRadius: 5, borderWidth: 1, borderColor: quality_style.borderColor,
                                backgroundColor: quality_style.backgroundColor,
                            }}
                                source={image.img}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: px2pd(24) }} >
                            <Text style={[{ fontSize: 22 }, { color: quality_style.fontColor }]} numberOfLines={1}>{data.item.name}</Text>
                        </View>
                        <View style={{ position: 'absolute', right: 0 }}>
                            <Text style={{ marginRight: 10, fontSize: 22, color: '#424242', textAlign: 'right' }}>x{data.item.num}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={props.currentStyles.viewContainer}>
            <View style={styles.propsContainer}>
                <View style={{ height: 40, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View>
                        <Text>金币：0</Text>
                    </View>
                    <View>
                        <Text>银币：0</Text>
                    </View>
                    <View>
                        <Text>铜币：{props.user.copper}</Text>
                    </View>
                </View>
                <View style={{ height: 38 }}>
                    <ScrollView horizontal={true}
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <PropTabButton title={"全部"} style={{ marginLeft: 8, marginRight: 15 }} onPress={() => { typeFilter('全部') }} />
                        <PropTabButton title='材料' style={{ marginRight: 15 }} onPress={() => { typeFilter('材料') }} />
                        <PropTabButton title='装备' style={{ marginRight: 15 }} onPress={() => { typeFilter('装备') }} />
                        <PropTabButton title='丹药' style={{ marginRight: 15 }} onPress={() => { typeFilter('丹药') }} />
                        <PropTabButton title='碎片' style={{ marginRight: 15 }} onPress={() => { typeFilter('碎片') }} />
                        <PropTabButton title='特殊' style={{ marginRight: 10 }} onPress={() => { typeFilter('特殊') }} />
                        {
                            (DEBUG_MODE)
                                ? <PropTabButton title='测试' style={{ marginRight: 10 }} onPress={() => { testHandler() }} />
                                : <></>
                        }
                    </ScrollView>
                </View>
                <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginLeft: 20, fontSize: 14, color: '#929292' }}>名称</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginRight: 20, textAlign: 'right', fontSize: 14, color: '#929292' }}>数量</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, marginBottom: 10, }}>
                    <FlatList
                        style={{ paddingTop: 2, alignContent: 'stretch' }}
                        data={props.listData}
                        renderItem={renderItem}
                        initialNumToRender={25}
                        keyExtractor={item => item.recordId}
                    />
                </View>
                <View style={{ width: "100%", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", }}>
                    <ReturnButton onPress={props.onClose} />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly" }}>
                        <WorldButton name={'尘界'} {...props} />
                        <WorldButton name={'现实'} {...props} />
                        <WorldButton name={'灵修界'} {...props} />
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    propsContainer: {
        flex: 1,
        margin: 10,
        alignSelf: 'stretch',
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
    propSelected: {
        backgroundColor: '#d6d6d6',
        opacity: 1,
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
});

export default connect((state) => ({ ...state.AppModel, ...state.PropsModel, user: { ...state.UserModel } }))(PropsPage);
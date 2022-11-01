import React from 'react';
import FastImage from 'react-native-fast-image';

import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import {
    Animated, DeviceEventEmitter,
} from 'react-native';

import lo from 'lodash';
import { isPad, px2pd, SCALE_FACTOR } from '../../constants/resolution';
import { EventKeys, getWindowSize, ThemeContext } from '../../constants';
import { confirm } from '../dialog/ConfirmDialog';
import Flower from '../animation/Flower';
import { PlantPage } from '../plant';
import { ComposeUtils } from '../../pages/home/ComposePage';
import ShopsUtils from '../../utils/ShopsUtils';
import LotteryUtils from '../../utils/LotteryUtils';
import AlchemyRoomModal from '../alchemyRoom';
import lianQiPage from '../lianQi';
import WorshipModal from '../worship';

const MAP_DATA = [
    {
        id: 1,
        images: {
            front:  require('../../../assets/maps/town/front_01.png'),
            middle: require('../../../assets/maps/town/mid_01.png'),
        },
        farPoints: [
            { style: { left: px2pd(200) * SCALE_FACTOR, top: px2pd(730) }, name: 'BaiShouShan', title: '百兽山' },
        ],
        nearPoints: [
        ],
    },
    {
        id: 2,
        images: {
            front:  require('../../../assets/maps/town/front_02.png'),
            middle: require('../../../assets/maps/town/mid_02.png'),
        },
        farPoints: [
            { style: { left: px2pd(20) * SCALE_FACTOR, top: px2pd(1050) * (isPad() ? 0.94 : 1) }, name: 'LingYaoTian', title: '灵药田' },
            { style: { left: px2pd(300) * SCALE_FACTOR, top: px2pd(550) * (isPad() ? 1.12 : 1) }, name: 'XunBao', title: '寻宝' },
            { style: { left: px2pd(40) * SCALE_FACTOR, top: px2pd(650) * (isPad() ? 1.12 : 1) }, name: 'GongFeng', title: '供奉' },
        ],
        nearPoints: [
        ],
    },
    {
        id: 3,
        images: {
            front:  require('../../../assets/maps/town/front_03.png'),
            middle: require('../../../assets/maps/town/mid_03.png'),
        },
        farPoints: [
        ],
        nearPoints: [
            { style: { left: px2pd(200) * SCALE_FACTOR, top: px2pd(880) * (isPad() ? 0.76 : 1) }, name: 'LianQiFeng', title: '练器峰' },
            { style: { left: px2pd(430) * SCALE_FACTOR, top: px2pd(950) * (isPad() ? 0.76 : 1) }, name: 'HeChengFeng', title: '合成峰' },
        ],
    },
    {
        id: 4,
        images: {
            front:  require('../../../assets/maps/town/front_04.png'),
            middle: require('../../../assets/maps/town/mid_04.png'),
        },
        farPoints: [
            { style: { left: px2pd(130) * SCALE_FACTOR, top: px2pd(800) }, name: 'YanWuTing', title: '演武亭' },
        ],
        nearPoints: [
        ],
    },
    {
        id: 5,
        images: {
            front:  require('../../../assets/maps/town/front_05.png'),
            middle: require('../../../assets/maps/town/mid_05.png'),
        },
        farPoints: [
            { style: { left: px2pd(190) * SCALE_FACTOR, top: px2pd(430) * (isPad() ? 1.2 : 1) }, name: 'ZhenYaoTa', title: '镇妖塔' },
            { style: { left: px2pd(20) * SCALE_FACTOR, top: px2pd(810) }, name: 'LianDanFang', title: '炼丹房' },
        ],
        nearPoints: [
            { style: { left: px2pd(410) * (isPad() ? 0.66 : 1), top: px2pd(810) * (isPad() ? 0.76 : 1) }, name: 'ShiChang', title: '市场' },
        ],
    },
];

const EntryButton = (props) => {
    const themeStyle = React.useContext(ThemeContext);

    return (
        <TouchableWithoutFeedback onPress={() => {
                confirm('确认进入？', () => {
                    switch (props.name) {
                        case 'LingYaoTian':
                            PlantPage.show();
                            break;
                        case 'LianQiFeng':
                            lianQiPage.show();
                            break;
                        case 'ShiChang':
                            ShopsUtils.show();
                            break;
                        case 'XunBao':
                            LotteryUtils.show();
                            break;
                        case 'LianDanFang':
                            AlchemyRoomModal.show();
                            break;
                        case 'HeChengFeng':
                            ComposeUtils.show();
                        case 'GongFeng':
                            WorshipModal.show();
                            break;
                    }
                    DeviceEventEmitter.emit(EventKeys.TOWN_ENTER, { title: props.title, name: props.name });
                });
            }}>
            <View style={{ ...props.style }}>
                <FastImage style={{ width: px2pd(84) * SCALE_FACTOR, height: px2pd(211) * SCALE_FACTOR }} source={themeStyle.townMapButtonImage} />
                <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[{ width: px2pd(40), textAlign: 'center' }, props.textStyle, { ...themeStyle.townMapButtonLabel }]}>{props.title}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const TownMap = (props) => {

    const WIN_SIZE = getWindowSize();
    const fixedTop = WIN_SIZE.height / 2 - 380;

    const status = React.useRef({ startX: 0, prevLeftPos: 0 }).current;
    const leftPos = React.useRef(new Animated.Value(0)).current;
    const refFall = React.useRef(null);

    const renderItem = (data) => {
        const { item } = data;

        let idx = 0;
        const farPoints = [];
        if (lo.isArray(item.farPoints)) {
            item.farPoints.forEach(e => {
                farPoints.push(
                    <View style={{ position: 'absolute' }} key={idx}>
                        <EntryButton {...e} />
                    </View>
                );
                idx++;
            });
        }

        const nearPoints = [];
        if (lo.isArray(item.nearPoints)) {
            item.nearPoints.forEach(e => {
                nearPoints.push(
                    <Animated.View style={{ position: 'absolute', left: leftPos, top: fixedTop }} key={idx}>
                        <EntryButton {...e} />
                    </Animated.View>
                );
                idx++;
            });
        }

        return (
            <View style={{ width: 'auto', height: '100%', backgroundColor: '#fff' }}>
                {/* 中景图 */}
                <FastImage style={{ width: px2pd(500) * SCALE_FACTOR, height: px2pd(1300) * SCALE_FACTOR, top: fixedTop }} source={item.images.middle} />
                {/* 前景图 */}
                <Animated.View style={{ position: 'absolute', left: leftPos, top: fixedTop }} pointerEvents='none'>
                    <FastImage style={{ width: px2pd(500) * SCALE_FACTOR, height: px2pd(1300) * SCALE_FACTOR }} source={item.images.front} />
                </Animated.View>
                {farPoints}
                {nearPoints}
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={MAP_DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode='never'
                onScrollBeginDrag={(e) => {
                    const { x } = e.nativeEvent.contentOffset;
                    status.startX = x;
                    status.prevLeftPos = leftPos._value;
                }}
                onScroll={(e) => {
                    const { x } = e.nativeEvent.contentOffset;
                    const diff = Math.abs(x - status.startX);
                    refFall.current.setTranslateX(-x);

                    if (x <= 0) {
                        leftPos.setValue(0);
                        return;
                    }

                    if (x > status.startX) {
                        leftPos.setValue(status.prevLeftPos - diff/5);
                    } else if (x < status.startX) {
                        leftPos.setValue(status.prevLeftPos + diff/5);
                    }
                }}
            />
            <Flower ref={(ref) => refFall.current = ref} />
        </View>
    );
}

export default TownMap;
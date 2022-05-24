import React from 'react';
import FastImage from 'react-native-fast-image';

import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import {
    Animated,
} from 'react-native';

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';
import { getWindowSize, ThemeContext } from '../../constants';
import { confirm } from '../dialog/ConfirmDialog';

const MAP_DATA = [
    {
        id: 1,
        images: {
            front:  require('../../../assets/maps/town/front_01.png'),
            middle: require('../../../assets/maps/town/mid_01.png'),
        },
        farPoints: [
            { style: { left: 150, top: 200 }, title: '桃花岛' },
        ],
        nearPoints: [
            { style: { left: 80, top: 300 }, title: '桃花岛' },
        ],
    },
    {
        id: 2,
        images: {
            front:  require('../../../assets/maps/town/front_02.png'),
            middle: require('../../../assets/maps/town/mid_02.png'),
        },
        farPoints: [
            { style: { left: 150, top: 180 }, title: '桃花岛' },
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
            { style: { left: 150, top: 200 }, title: '桃花岛' },
        ],
        nearPoints: [
            { style: { left: 80, top: 300 }, title: '桃花岛' },
        ],
    },
    {
        id: 4,
        images: {
            front:  require('../../../assets/maps/town/front_04.png'),
            middle: require('../../../assets/maps/town/mid_04.png'),
        },
        farPoints: [
            { style: { left: 150, top: 180 }, title: '桃花岛' },
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
        ],
        nearPoints: [
            { style: { left: 80, top: 300 }, title: '桃花岛' },
        ],
    },
];

const EntryButton = (props) => {
    const themeStyle = React.useContext(ThemeContext);

    return (
        <TouchableWithoutFeedback onPress={() => {
                confirm('确认进入？');
            }}>
            <View style={{ ...props.style }}>
                <FastImage style={{ width: px2pd(84), height: px2pd(211) }} source={themeStyle.townMapButtonImage} />
                <Text style={[{ position: 'absolute', left: 8, top: 12, width: 20 }, { ...themeStyle.townMapButtonLabel }]}>{props.title}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const TownMap = (props) => {

    const WIN_SIZE = getWindowSize();
    const fixedTop = WIN_SIZE.height / 2 - 380;

    const status = React.useRef({ startX: 0, prevLeftPos: 0 }).current;
    const leftPos = React.useRef(new Animated.Value(0)).current;

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
                <FastImage style={{ width: px2pd(500), height: px2pd(1300), top: fixedTop }} source={item.images.middle} />
                {/* 前景图 */}
                <Animated.View style={{ position: 'absolute', left: leftPos, top: fixedTop }} pointerEvents='none'>
                    <FastImage style={{ width: px2pd(500), height: px2pd(1300) }} source={item.images.front} />
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
        </View>
    );
}

export default TownMap;
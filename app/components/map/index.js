import React from 'react';
import FastImage from 'react-native-fast-image';

import {
    View,
    FlatList,
} from '../../constants/native-ui';

import {
    Animated,
} from 'react-native';

import { px2pd } from '../../constants/resolution';
import { getWindowSize } from '../../constants';

const MAP_DATA = [
    {
        id: 1,
        images: {
            front:  require('../../../assets/maps/town/front_01.png'),
            middle: require('../../../assets/maps/town/mid_01.png'),
        }
    },
    {
        id: 2,
        images: {
            front:  require('../../../assets/maps/town/front_02.png'),
            middle: require('../../../assets/maps/town/mid_02.png'),
        }
    },
    {
        id: 3,
        images: {
            front:  require('../../../assets/maps/town/front_03.png'),
            middle: require('../../../assets/maps/town/mid_03.png'),
        }
    },
    {
        id: 4,
        images: {
            front:  require('../../../assets/maps/town/front_04.png'),
            middle: require('../../../assets/maps/town/mid_04.png'),
        }
    },
    {
        id: 5,
        images: {
            front:  require('../../../assets/maps/town/front_05.png'),
            middle: require('../../../assets/maps/town/mid_05.png'),
        }
    },
];

const MapView = (props) => {

    const WIN_SIZE = getWindowSize();
    const fixedTop = WIN_SIZE.height / 2 - 380;

    const status = React.useRef({ startX: 0, prevLeftPos: 0 }).current;
    const leftPos = React.useRef(new Animated.Value(0)).current;

    const renderItem = (data) => {
        const { item } = data;
        return (
            <View style={{ width: 'auto', height: '100%', backgroundColor: '#fff' }}>
                {/* 中景图 */}
                <FastImage style={{ width: px2pd(500), height: px2pd(1300), top: fixedTop }} source={item.images.middle} />
                {/* 前景图 */}
                <Animated.View style={{ position: 'absolute', left: leftPos, top: fixedTop }}>
                    <FastImage style={{ width: px2pd(500), height: px2pd(1300) }} source={item.images.front} />
                </Animated.View>
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

export default MapView;
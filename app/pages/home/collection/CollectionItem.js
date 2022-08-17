import React from 'react';

import {
    View,
} from '../../../constants/native-ui';

import { 
    TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';
import StarsBanner from './StarsBanner';

const BACKGROUND_IMAGES = [
    require('../../../../assets/collection/bg_1.png'),
    require('../../../../assets/collection/bg_2.png'),
    require('../../../../assets/collection/bg_3.png'),
    require('../../../../assets/collection/bg_4.png'),
];

const CollectionItem = (props) => {

    // 衬底图片
    const backgroundImage = BACKGROUND_IMAGES[lo.random(0, 3)];

    return (
    <TouchableWithoutFeedback onPress={() => {
    }}>
        <View style={{ width: px2pd(220), height: px2pd(230),  }}>
            <FastImage style={{ marginLeft: 3, width: px2pd(200), height: px2pd(200) }} source={require('../../../../assets/collection/item_1.png')} />
            <View style={{ position: 'absolute', bottom: -10, zIndex: -1, }}>
                <FastImage style={{ width: px2pd(220), height: px2pd(150) }} source={backgroundImage} />
            </View>
            <View>
                <StarsBanner max={6} star={3} />
            </View>
        </View>
    </TouchableWithoutFeedback>
    );
}

export default CollectionItem;
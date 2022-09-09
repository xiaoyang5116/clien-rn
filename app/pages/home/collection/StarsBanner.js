import React from 'react';

import {
    View,
} from '../../../constants/native-ui';

import lo from 'lodash';
import { px2pd } from '../../../constants/resolution';
import FastImage from 'react-native-fast-image';

const StarsBanner = (props) => {
    const items = [];
    lo.forEach(lo.range(props.max), (v, k) => {
        items.push(
            <View key={k} style={{ width: px2pd(24) }}>
            {
                (props.star >= (k + 1))
                ? <FastImage style={{ width: px2pd(37), height: px2pd(37) }} source={require('../../../../assets/collection/star.png')} />
                : <FastImage style={{ width: px2pd(37), height: px2pd(37) }} source={require('../../../../assets/collection/star_gray.png')} />
            }
            </View>
        );
    });

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {items}
        </View>
    );
}

export default StarsBanner;
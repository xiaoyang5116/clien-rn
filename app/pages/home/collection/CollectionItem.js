import React from 'react';

import {
    View,
} from '../../../constants/native-ui';

import { 
    TouchableWithoutFeedback,
} from 'react-native';

import lo from 'lodash';
import { px2pd } from '../../../constants/resolution';
import RootView from '../../../components/RootView';
import FastImage from 'react-native-fast-image';
import StarsBanner from './StarsBanner';
import ActivationPage from './ActivationPage';
import UpgradePage from './UpgradePage';
import CollectionUtils from '../../../utils/CollectionUtils';

const BACKGROUND_IMAGES = [
    require('../../../../assets/collection/bg_0.png'),
    require('../../../../assets/collection/bg_1.png'),
    require('../../../../assets/collection/bg_2.png'),
    require('../../../../assets/collection/bg_3.png'),
    require('../../../../assets/collection/bg_4.png'),
];

const CollectionItem = (props) => {

    // 衬底图片
    let backgroundImage = BACKGROUND_IMAGES[0];
    if (props.data.level > 0) {
        const imageId = CollectionUtils.getImageIdByStars(props.data.stars);
        backgroundImage = BACKGROUND_IMAGES[imageId];
    }

    return (
    <TouchableWithoutFeedback onPress={() => {
        if (!props.data.actived) {
            const key = RootView.add(<ActivationPage data={props.data} onClose={() => {
                RootView.remove(key);
            }} />);
        } else {
            const key = RootView.add(<UpgradePage data={props.data} onClose={() => {
                RootView.remove(key);
            }} />);
        }
    }}>
        <View style={{ width: px2pd(220), height: px2pd(240),  }}>
            <FastImage style={{ marginLeft: 3, width: px2pd(200), height: px2pd(200) }} source={(props.data.actived 
                ? require('../../../../assets/collection/item_1.png') 
                : require('../../../../assets/collection/item_1.gray.png'))} />
            <View style={{ position: 'absolute', bottom: -px2pd(16), zIndex: -1, }}>
                <FastImage style={{ width: px2pd(220), height: px2pd(150) }} source={backgroundImage} />
            </View>
            <View>
                <StarsBanner max={props.data.stars} star={(props.data.level != undefined && props.data.level >= 0) ? props.data.level : 0} />
            </View>
        </View>
    </TouchableWithoutFeedback>
    );
}

export default CollectionItem;
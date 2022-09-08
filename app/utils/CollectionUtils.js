import React from 'react';
import RootView from '../components/RootView';
import CollectPage from '../pages/CollectPage';

export default class CollectionUtils {

    static getImageIdByStars(stars) {
        if (stars <= 3)
            return 1; // 绿
        else if (stars == 4)
            return 2; // 蓝
        else if (stars == 5)
            return 3; // 紫
        else if (stars == 6)
            return 4; // 橙
    }
}
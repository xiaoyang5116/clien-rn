import React from 'react';
import RootView from '../components/RootView';
import ShopPage from '../pages/shop';

export default class ShopsUtils {
    static show(shopId = 'default') {
        const key = RootView.add(<ShopPage shopId={shopId} onClose={() => {
            RootView.remove(key);
        }} />);
    }
}
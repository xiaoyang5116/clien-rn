import React from 'react';

import ShopPage from ".";
import RootView from "../../components/RootView";

export class ShopUtils {
    static show(shopId = 'default') {
        const key = RootView.add(<ShopPage shopId={shopId} onClose={() => {
            RootView.remove(key);
        }} />);
    }
}
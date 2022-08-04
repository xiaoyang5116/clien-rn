import React from 'react';

import ShopPage from ".";
import RootView from "../../components/RootView";

export class ShopUtils {
    static show() {
        const key = RootView.add(<ShopPage onClose={() => {
            RootView.remove(key);
        }} />);
    }
}
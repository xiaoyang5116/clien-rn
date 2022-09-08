import React from 'react';
import { View } from 'react-native';

import RootView from '../RootView';
import MaskModal from './MaskModal';
import { DialogRoutes } from '../dialog';


class Modal {
    static show(payload) {
        const { style } = payload;
        if ((style >= 5 && style <= 10) || (style === "9A" || style === "9B") || (style === "5A" || style === "5B")) {
            const key = RootView.add(
                <View style={{ flex: 1, zIndex: 1, backgroundColor: "rgba(102, 102, 102, 0.6)" }}>
                    <DialogRoutes viewData={payload} onDialogCancel={() => {
                        RootView.remove(key);
                    }} />
                </View>
            )
        } else {
            const key = RootView.add(
                <MaskModal data={payload} onModalHide={() => {
                    RootView.remove(key);
                }} />
            );
        }
    }
}

export default Modal;
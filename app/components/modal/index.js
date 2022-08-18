import React from 'react';

import RootView from '../RootView';
import MaskModal from './MaskModal';
import { DialogRoutes } from '../dialog';

class Modal {
    static show(payload) {
        const { style } = payload;
        if ((style >= 6 && style <= 10) || (style === "9A" || style === "9B")) {
            const key = RootView.add(<DialogRoutes viewData={payload} onDialogCancel={() => {
                RootView.remove(key);
            }} />)
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
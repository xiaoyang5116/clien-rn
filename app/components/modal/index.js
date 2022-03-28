import React, {
} from 'react';

import RootView from '../RootView';
import MaskModal from './MaskModal';

class Modal {

    static show(payload) {
        const key = RootView.add(
            <MaskModal viewData={payload} onModalHide={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default Modal
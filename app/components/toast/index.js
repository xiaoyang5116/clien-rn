import React, {
} from 'react';

import RootView from '../RootView';
import ToastView from './ToastView';

class Toast {

    static show(message = '', type = 'BottomToTop', time = 600) {
        const key = RootView.add(
            <ToastView message={message} type={type} time={time} onHide={() => {
                RootView.remove(key);
            }} />
        );
    }
}

export default Toast
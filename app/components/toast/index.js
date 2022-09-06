import React, {
} from 'react';

import { BOTTOM_TOP } from '../../constants'

import RootView from '../RootView';
import ToastView from './ToastView';

class Toast {

    static show(message = '', type = BOTTOM_TOP, time = 600, closeFunc = null) {
        const key = RootView.add(
            <ToastView message={message} type={type} time={time} onHide={() => {
                RootView.remove(key);
                if (closeFunc != null) {
                    closeFunc();
                }
            }} />
        )
    }
}

export default Toast
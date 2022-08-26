import React, {
} from 'react';

import { BOTTOM_TOP } from '../../constants'

import RootView from '../RootView';
import ToastView from './ToastView';

class Toast {

    static show(message = '', type = BOTTOM_TOP, time = 600, closeFunc = null) {
        if (Array.isArray(message)) {
            let num = 0
            let timer = setInterval(() => {
                if (num < message.length) {
                    const key = RootView.add(
                        <ToastView message={message[num]} type={type} time={time} onHide={() => {
                            RootView.remove(key);
                            if (closeFunc != null) {
                                closeFunc();
                            }
                        }} />
                    );
                    num++
                } else {
                    clearInterval(timer)
                }
            }, 500)

        } else {
            const key = RootView.add(
                <ToastView message={message} type={type} time={time} onHide={() => {
                    RootView.remove(key);
                    if (closeFunc != null) {
                        closeFunc();
                    }
                }} />
            );
        }
    }
}

export default Toast
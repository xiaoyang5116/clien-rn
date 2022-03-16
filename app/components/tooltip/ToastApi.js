import React, {
    Component,
} from 'react';
import RootView from './RootView'


class ToastApi {

    static addView(message = '', type = 'BottomToTop', time = 1000) {
        return RootView.addView({
            message,
            type,
            time,
        })
    }
}

export default ToastApi
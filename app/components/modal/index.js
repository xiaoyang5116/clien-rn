import React from 'react';

import {
    DeviceEventEmitter,
    EventKeys,
} from "../../constants";

class Modal {
    // 显示模态窗口
    static show(payload) {
        DeviceEventEmitter.emit(EventKeys.MODAL_SHOW, payload);
    }
}

export default Modal;
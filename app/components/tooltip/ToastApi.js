import React, {
    Component,
} from 'react';
import RootView from './RootView'
import ToastView from './ToastView'


class ToastApi {
    // static LONG = 2000;
    // static SHORT = 1000;

    // static show(msg) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         onDismiss={() => {
    //             RootView.setView()
    //         }} />)
    // }

    static addView(obj) {
        RootView.addView({
            message: obj.message,
            type: 'BottomToTop',
            key: obj.key,
            time: 2000,
        })
    }

    // static success(msg) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="success"
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static success(msg, time) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="success"
    //         time={time}
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static error(msg) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="error"
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static error(msg, time) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="error"
    //         time={time}
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static warning(msg) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="warning"
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static warning(msg, time) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="warning"
    //         time={time}
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static info(msg) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="info"
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }

    // static info(msg, time) {
    //     RootView.setView(<ToastView
    //         message={msg}
    //         type="info"
    //         time={time}
    //         onDismiss={() => {
    //             RootView.setView()
    //         }}/>)
    // }
}

export default ToastApi
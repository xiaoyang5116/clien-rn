
import { DeviceEventEmitter } from 'react-native';

export default class EventListeners {
    static _listeners = [];

    static register(event, f) {
        const listener = DeviceEventEmitter.addListener(event, f);
        EventListeners._listeners.push({ event, listener });
    }

    static raise(event, payload) {
        DeviceEventEmitter.emit(event, payload);
    }

    static removeAllListeners() {
        EventListeners._listeners.forEach(e => {
            e.listener.remove();
        });
        EventListeners._listeners.length = 0;
    }
}

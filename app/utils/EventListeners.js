
export default class EventListeners {
    static _listeners = [];

    static register(event, f) {
        EventListeners._listeners.push({ event, f });
    }

    static raise(event, payload) {
        EventListeners._listeners.forEach(listener => {
            if (listener.event == event) {
                listener.f(payload);
            }
        });
    }

    static removeAllListeners() {
        EventListeners._listeners.length = 0;
    }
}

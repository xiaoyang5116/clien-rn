
export default class EventListeners {
    static _listeners = [];

    static register(event, f) {
        EventListeners._listeners.push({ event, f });
    }

    static raise(event, payload) {
        const waitObjects = [];
        EventListeners._listeners.forEach(listener => {
            if (listener.event == event) {
                const ret = listener.f(payload);
                if (ret != undefined && ret instanceof Promise) {
                    waitObjects.push(ret);
                }
            }
        });
        return Promise.all(waitObjects);
    }

    static removeAllListeners() {
        EventListeners._listeners.length = 0;
    }
}

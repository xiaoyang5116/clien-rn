import {
    action,
    LocalCacheKeys,
    EventKeys,
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';


export default {
    namespace: 'SoundModel',
    state: {
        sceneVolume: {},
        readerVolume: {},
    },
    effects: {
        *reload({ }, { call, put, select }) {
            const soundData = yield call(LocalStorage.get, LocalCacheKeys.SOUND_DATA)
            if (soundData !== null) {
                yield put(action('updateSound')(soundData));
            }
            else {
                const defaultSoundData = {
                    sceneVolume: {
                        bg: 0.5,
                        effct: 0.5,
                    },
                    readerVolume: {
                        bg: 0.5,
                        effct: 0.5
                    }
                }
                yield call(LocalStorage.set, LocalCacheKeys.SOUND_DATA, defaultSoundData);
                yield put(action('updateSound')(defaultSoundData));
            }
        },
        *changeSoundData({ payload }, { call, put, select }) { 

        },
    },
    reducers: {
        updateSound(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },

    },
    subscriptions: {
        registerReloadEvent({ dispatch }) {
            EventListeners.register('reload', (msg) => {
                return dispatch({ 'type': 'reload' });
            });
        },
    }
}
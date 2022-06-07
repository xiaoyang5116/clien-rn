import {
    action,
    LocalCacheKeys,
} from "../constants";
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

import {
    GetSoundDataApi
} from '../services/GetSoundDataApi';

export default {
    namespace: 'SoundModel',

    state: {
        masterVolume: {},
        readerVolume: {},
    },

    effects: {
        *reload({ }, { call, put, select }) {
            // 1. 加载本地配置
            const soundData = yield call(LocalStorage.get, LocalCacheKeys.SOUND_DATA);
            if (soundData == null) {
                // 缺省音量
                const defaultValues = {
                    // 主音量
                    masterVolume: {
                        bg: 0.5,
                        effct: 0.5,
                    },
                    // 阅读器音量（副音量）
                    readerVolume: {
                        bg: 0.5,
                        effct: 0.5
                    }
                }
                soundData = defaultValues;
                yield call(LocalStorage.set, LocalCacheKeys.SOUND_DATA, soundData);
            }
            //
            yield put(action('updateSound')(soundData));
        },

        *setVolume({ payload }, { call, put, select }) {
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
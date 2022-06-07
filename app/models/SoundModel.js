import {
    action,
    LocalCacheKeys,
    DeviceEventEmitter,
    EventKeys,
} from "../constants";

import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';

export default {
    namespace: 'SoundModel',

    state: {
        // 主音量
        masterVolume: {
            bg: 0.5,
            effect: 0.5,
        },
        // 阅读器音量（副音量）
        readerVolume: {
            bg: 0.5,
            effect: 0.5,
        },
    },

    effects: {
        *reload({ }, { call, put, select }) {
            // 加载本地配置
            const soundData = yield call(LocalStorage.get, LocalCacheKeys.SOUND_DATA);
            if (soundData != null) {
                yield put(action('updateSound')(soundData));
            }
        },

        *setVolume({ payload }, { call, put, select }) {
            const { category, type, volume } = payload;
            const soundState = yield select(state => state.SoundModel);
            const newState = { masterVolume: lo.cloneDeep(soundState.masterVolume), readerVolume: lo.cloneDeep(soundState.readerVolume) };
            const volumes = newState[type];
            volumes[category] = volume;

            if (lo.isEqual(category, 'bg')) {
                DeviceEventEmitter.emit(EventKeys.SOUND_BG_VOLUME_UPDATE, { type, volume });
            } else if (lo.isEqual(category, 'effect')) {
                DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, { type, volume });
            }

            yield put(action('updateSound')(newState));
            yield call(LocalStorage.set, LocalCacheKeys.SOUND_DATA, newState);
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
import {
    action,
    LocalCacheKeys,
    DeviceEventEmitter,
    EventKeys,
    inReaderMode,
} from "../constants";

import lo from 'lodash';
import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { GetSoundDataApi } from "../services/GetSoundDataApi";
import { playSound } from "../components/sound/utils";

export default {
    namespace: 'SoundModel',

    state: {
        __data: {
            config: [],
        },
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
        // 跟随主音量
        followMasterVolume: true,
    },

    effects: {
        *reload({ }, { call, put, select }) {
            const soundState = yield select(state => state.SoundModel);
            // 加载本地配置
            const soundData = yield call(LocalStorage.get, LocalCacheKeys.SOUND_DATA);
            if (soundData != null) {
                yield put(action('updateSound')(soundData));
            }
            // 加载音乐配置
            const configData = yield call(GetSoundDataApi);
            soundState.__data.config.length = 0;
            if (lo.isArray(configData.sound)) {
                soundState.__data.config.push(...configData.sound);
            }
        },

        *checkAudio({ payload }, { call, put, select }) {
            const soundState = yield select(state => state.SoundModel);
            const { routeName } = payload;

            // 监听导航路径切换
            if (lo.isString(routeName)) {
                const found = soundState.__data.config.find(e => (!lo.isUndefined(e.routeName) && lo.isEqual(e.routeName, routeName)));
                if (!lo.isUndefined(found)) {
                    const type = inReaderMode() ? 'readerVolume' : 'masterVolume';
                    playSound({ ...found, type })
                }
            }
        },

        *setVolume({ payload }, { call, put, select }) {
            const { category, type, volume, followMasterVolume } = payload;
            const soundState = yield select(state => state.SoundModel);
            const newState = { 
                masterVolume: lo.cloneDeep(soundState.masterVolume), 
                readerVolume: lo.cloneDeep(soundState.readerVolume),
                followMasterVolume: followMasterVolume,
            };
            const volumes = newState[type];
            volumes[category] = volume;

            if (lo.isEqual(category, 'bg')) {
                DeviceEventEmitter.emit(EventKeys.SOUND_BG_VOLUME_UPDATE, { type, volume });
            } else if (lo.isEqual(category, 'effect')) {
                DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, { type, volume });
            }

            // 跟随主音
            if (followMasterVolume) {
                newState.readerVolume.bg = newState.masterVolume.bg;
                newState.readerVolume.effect = newState.masterVolume.effect;
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
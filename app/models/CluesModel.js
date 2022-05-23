
import {
    action,
    LocalCacheKeys,
    DeviceEventEmitter,
    EventKeys,
} from "../constants";

import LocalStorage from '../utils/LocalStorage';
import EventListeners from '../utils/EventListeners';
import { GetClueDataApi } from "../services/GetClueDataApi";


export default {
    namespace: 'CluesModel',

    state: {
        cluesList: [],
    },

    effects: {
        *reload({ }, { call, put, select }) {
            let cluesList = yield call(LocalStorage.get, LocalCacheKeys.CLUES_DATA);
            if (cluesList !== null) {
                yield put.resolve(action('updateState')({ cluesList }));
            }
        },
        *addClue({ payload }, { call, put, select }) {
            // payload: { cluesType: "SCENE", name: "xiansuo1" }
            const { cluesList } = yield select(state => state.CluesModel);
            const clueData = yield call(GetClueDataApi, payload);
            let currentTypeClues = cluesList.find(f => f.cluesType === payload.cluesType);
            if (currentTypeClues === undefined) {
                const newClue = {
                    cluesType: payload.cluesType,
                    data: [clueData],
                }
                const newCluesList = [...cluesList, newClue];
                yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, newCluesList);
                yield put(action('updateState')({ cluesList: newCluesList }));
            }
            else {
                const newCluesList = cluesList.map(f => f.cluesType === payload.cluesType ? { ...f, data: [clueData, ...f.data] } : f);
                yield call(LocalStorage.set, LocalCacheKeys.CLUES_DATA, newCluesList);
                yield put(action('updateState')({ cluesList: newCluesList }));
            }
        },
    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    },

    subscriptions: {
        registerReloadEvent({ dispatch }) {
            EventListeners.register('reload', (msg) => {
                return dispatch({ 'type': 'reload' });
            });
        },
    }
}

